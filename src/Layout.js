import React from "react";
import _ from "lodash";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Responsive, WidthProvider } from "react-grid-layout";
import Dropzone from 'react-dropzone'
import fileSaver from 'file-saver'
import * as actions from './action'
import Plot from './plots'
import { getPlotData } from './utils'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Layout.css'
import Upload from './upload-button.png'
import Yaml from 'yamljs'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const dropZoneStyle = {
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
    compactType: "vertical",
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    console.log('mount');
    this.props.addChart({
      key: 'upload',
      layout: {
        i: 'upload',
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        minW: 3,
        minH: 3
      },
      chart: {}
    })
  }

  renderPlot = (l, i) => {
    const { layout } = l;
    console.log(l);
    if (layout.i === 'upload') {
      let dropZoneRef
      return (
        <div key="upload" style={{ borderStyle: 'dashed' }} data-grid={layout} onDoubleClick={() => {dropZoneRef.open()}}>
          <Dropzone
            ref={(node) => { dropZoneRef = node;}}
            onDrop={this.onDrop}
            disableClick
            style={dropZoneStyle}
          >
            <img src={Upload} width="50%" height="50%" />
          </Dropzone>
        </div>)
    }
	  return (
      <div key={i} data-grid={layout}>
        <Plot
          data={getPlotData(this.props.data, l)}
          width={layout.w}
          height={layout.h}
        />
      </div>
	  );
	}

  onBreakpointChange = breakpoint => {
	this.setState({
	  currentBreakpoint: breakpoint
	});
  };

  onCompactTypeChange = () => {
	const { compactType: oldCompactType } = this.state;
	const compactType =
	  oldCompactType === "horizontal"
		? "vertical"
		: oldCompactType === "vertical" ? null : "horizontal";
	this.setState({ compactType });
  };

  onLayoutChange = (layout, layouts) => {
    if (this.state.mounted) {
      const rwdLayouts = Object.values(layouts).find(l => l.length != 0) || [];
      this.props.updateChartLayouts(rwdLayouts);
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
      console.log(reader);
      const chart = Yaml.parse(fileAsBinaryString)
      const key = (this.props.charts.length-1).toString()
      const layout = this.props.charts.find(c => c.layout.i === 'upload').layout
      this.props.addChart({
        key,
        layout: { ...layout, i: key },
        chart,
      })
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(accept[0]);

  }

  render() {
    return (
      <ResponsiveReactGridLayout
        {...this.props}
        // layouts={{ lg: this.props.data.map((_, i) => ({ x: (i%4)*3, y: (i/4)*3, w: 3, h: 3 }))}}
        // layouts={{ lg: this.state.layouts }}
        onBreakpointChange={this.onBreakpointChange}
        onLayoutChange={this.onLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}
        compactType="vertical"
      >
        {this.props.charts.map(this.renderPlot)}
      </ResponsiveReactGridLayout>
    );
  }
}

export default compose(connect(
    ({ connector, charts }) => ({
      data: connector.data ? connector.data : [],
      charts: Object.values(charts),
    }),
    { ...actions }
  ))(ShowcaseLayout);
