import React from "react";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Responsive, WidthProvider } from "react-grid-layout";
import Dropzone from 'react-dropzone'
import fileSaver from 'file-saver'
import * as actions from './action'
import { addCheckpoint } from './store/checkpointEnhancer'
import Block from './chart'
import FullscreenBlock from './chart/fullscreen'
import CodeMirror from 'react-codemirror'
import { getPlotData } from './utils'
import Yaml from 'yamljs'
import { isLayoutsEqual } from './utils'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml'
import './Layout.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const dropZoneStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
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
    this.props.addBlock({
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
      block: {}
    })
  }

  setFullscreen = (key) => {
    this.setState({ fullscreen: key })
  }

  removeBlock = (key) => () => {
    this.props.removeBlock(key)
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
    this.props.updateBlockSchema(key, schema)
    this.onEditorChange('')
  }

  onLayoutChange = (layouts) => {
    if (this.state.mounted) {
      console.log('layout',this.props.blocks.map(c => c.layout), layouts)
      if (!isLayoutsEqual(this.props.blocks.map(c => c.layout), layouts))
        this.props.addCheckpoint()
      this.props.updateBlockLayouts(JSON.parse(JSON.stringify(layouts)))
    }
  };

  downloadBlocks = () => {
    const data = JSON.stringify(this.props.blocks)
    fileSaver.saveAs(new Blob([data], {type: "application/json"}), "plot.json");
  }


  onDrop = (accept, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      const block = Yaml.parse(fileAsBinaryString)
      const key = (this.props.blocks.length-1).toString()
      const layout = this.props.blocks.find(c => c.layout.i === 'upload').layout
      this.props.addCheckpoint()
      this.props.addBlock(JSON.parse(JSON.stringify({
        key,
        layout: { ...layout, i: key },
        block,
      })))
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(accept[0]);

  }

  renderPlot = (l) => {
    const { layout, key, ...block } = l;
    console.log(this.props, l)
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
            <i className="icon-file-upload" style={{ fontSize: '4rem' }} />
            <span>Upload chart</span>
          </Dropzone>
        </div>)
    }
    return (
      <div key={layout.i}>
        <Block
          layout={layout}
          data={getPlotData(this.props.data, l)}
          width={layout.w}
          height={layout.h}
          handleLock={this.props.updateBlockStatic}
          removeBlock={this.removeBlock(layout.i)}
          setFullscreen={this.setFullscreen}
          editBlock={() => {this.onEditorChange(Yaml.stringify(block))}}
        />
      </div>
    );
  }

  renderFullscreen = () => {
    const key = this.state.fullscreen
    return (
      <div className="overlay" onClick={this.closeFullscreen}>
        <div className="fullscreen-container">
          <FullscreenBlock
            onClick={(e) => {e.stopPropagation()}}
            layout={this.state.fullscreen}
            data={getPlotData(this.props.data, this.props.blocks.find(c => c.key === key))}
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
            options={{ lineNumbers: true, mode: 'yaml' }}
          />
          <i className="material-icons editor-close" onClick={this.closeEditor}>
            close
          </i>
        </div>
      </div>
    )
  }

  render() {
    // console.log(this.props.blocks);
    return (
      <div className="app-layout">
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={{[this.state.currentBreakpoint]: this.props.blocks.map(c => c.layout)}}
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
          {this.props.blocks.map(this.renderPlot)}
        </ResponsiveReactGridLayout>
        {this.state.fullscreen ? this.renderFullscreen() : null}
        {this.state.editor ? this.renderEditor() : null}
      </div>
    );
  }
}

export default compose(connect(
    ({ connector, blocks }) => ({
      data: connector.data ? connector.data : [],
      blocks: Object.keys(blocks).map(key => ({ key, ...blocks[key] })),
    }),
    { ...actions, addCheckpoint }
  ))(ShowcaseLayout);
