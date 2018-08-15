import React from "react";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Responsive, WidthProvider } from "react-grid-layout";
import Dropzone from 'react-dropzone'
import fileSaver from 'file-saver'
import * as actions from './action'
import { addCheckpoint } from './store/checkpointEnhancer'
import Chart from './chart'
import FullscreenChart from './chart/fullscreen'
import CodeMirror from 'react-codemirror'
import { getPlotData } from './utils'
import Upload from './upload-button.png'
import Yaml from 'yamljs'
import _ from 'lodash'
import { isLayoutsEqual } from './utils'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import 'codemirror/lib/codemirror.css'
import './Layout.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const dropZoneStyle = {
  display: 'flex',
  position: 'relative',
  width: '100%',
  height: '100%',
}


class ShowcaseLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 50,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    data: [],
  };

  state = {
    currentBreakpoint: "lg",
    fullscreen: null,
    mounted: false,
    editor: '',
  };

  componentDidMount() {
    this.setState({ mounted: true });
    // this.props.addCheckpoint()
    this.props.addChart({
      key: 'upload',
      layout: {
        i: 'upload',
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        minW: 3,
        minH: 3,
        moved: false,
        static: false,
      },
      chart: {}
    })
  }

  setFullscreen = (key) => {
    this.setState({ fullscreen: key })
  }

  removeChart = (key) => () => {
    this.props.removeChart(key)
  }

  closeFullscreen = () => {
    this.setState({ fullscreen: null })
  }

  onBreakpointChange = breakpoint => {
	this.setState({
	  currentBreakpoint: breakpoint
	});
  };

  onEditorChange = (value) => {
    this.setState({ editor: value })
  }

  closeEditor = () => {
    const { key, ...schema } = Yaml.parse(this.state.editor)
    this.props.updateChartSchema(key, schema)
    this.onEditorChange('')
  }

  onLayoutChange = (layouts) => {
    if (this.state.mounted) {
      console.log('layout',this.props.charts.map(c => c.layout), layouts)
      if (!isLayoutsEqual(this.props.charts.map(c => c.layout), layouts))
        this.props.addCheckpoint()
      this.props.updateChartLayouts(JSON.parse(JSON.stringify(layouts)))
    }
  };

  downloadCharts = () => {
    const data = JSON.stringify(this.props.charts)
    fileSaver.saveAs(new Blob([data], {type: "application/json"}), "plot.json");
  }


  onDrop = (accept, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      const chart = Yaml.parse(fileAsBinaryString)
      const key = (this.props.charts.length-1).toString()
      const layout = this.props.charts.find(c => c.layout.i === 'upload').layout
      this.props.addCheckpoint()
      this.props.addChart(JSON.parse(JSON.stringify({
        key,
        layout: { ...layout, i: key },
        chart,
      })))
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(accept[0]);

  }

  renderPlot = (l) => {
    const { layout, key, ...chart } = l;
    if (layout.i === 'upload') {
      let dropZoneRef
      return (
        <div key={layout.i} style={{ border: '2px solid #333', display: 'flex' }} data-grid={layout} onDoubleClick={() => {dropZoneRef.open()}}>
          <Dropzone
            ref={(node) => { dropZoneRef = node;}}
            onDrop={this.onDrop}
            disableClick
            style={dropZoneStyle}
          >
            <img src={Upload} className="uploadIcon" alt="upload" />
          </Dropzone>
        </div>)
    }
	  return (
      <div key={layout.i}>
        <Chart
          layout={layout}
          data={getPlotData(this.props.data, l)}
          width={layout.w}
          height={layout.h}
          handleLock={this.props.updateChartStatic}
          removeChart={this.removeChart(layout.i)}
          setFullscreen={this.setFullscreen}
          editChart={() => {this.onEditorChange(Yaml.stringify(chart))}}
        />
      </div>
	  );
	}

  renderFullscreen = () => {
    const key = this.state.fullscreen
    return (
      <div className="overlay">
        <div className="fullscreen-container">
          <FullscreenChart
            layout={this.state.fullscreen}
            data={getPlotData(this.props.data, this.props.charts.find(c => c.key === key))}
            close={this.closeFullscreen}
          />
        </div>
      </div>)
  }

  renderEditor = () => {
    return (
      <div className="overlay">
        <div className="editor-container">
          <CodeMirror
            className="editor"
            value={this.state.editor}
            onChange={this.onEditorChange}
            options={{ lineNumbers: true }}
          />
          <i className="material-icons editor-close" onClick={this.closeEditor}>
            close
          </i>
        </div>
      </div>
    )
  }

  render() {
    // console.log(this.props.charts);
    return (
      <div>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={{[this.state.currentBreakpoint]: this.props.charts.map(c => c.layout)}}
          // layouts={{ lg: this.state.layouts }}
          onBreakpointChange={this.onBreakpointChange}
          // onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          onDragStop={this.onLayoutChange}
          onResizeStop={this.onLayoutChange}
          useCSSTransforms={this.state.mounted}
          compactType="vertical"
        >
          {this.props.charts.map(this.renderPlot)}
        </ResponsiveReactGridLayout>
        {this.state.fullscreen ? this.renderFullscreen() : null}
        {this.state.editor ? this.renderEditor() : null}
      </div>
    );
  }
}

export default compose(connect(
    ({ connector, charts }) => ({
      data: connector.data ? connector.data : [],
      charts: Object.keys(charts).map(key => ({ key, ...charts[key] })),
    }),
    { ...actions, addCheckpoint }
  ))(ShowcaseLayout);
