import React from "react";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Responsive, WidthProvider } from "react-grid-layout";
import Dropzone from 'react-dropzone'
import fileSaver from 'file-saver'
import marked from 'marked'
import * as actions from './action'
import { addCheckpoint } from './store/checkpointEnhancer'
import Chart from './blocks'
import FullscreenBlock from './blocks/fullscreen'
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

  parseFile = (data, ext) => {
    let block = {}
    if (ext === 'yaml' || ext === 'yml') {
      block = { ...Yaml.parse(data), type: 'chart' }
    } else if (ext === 'md' || ext === 'markdown') {
      block = { content: data, type: 'markdown' }
    } else if (ext === 'png' || ext === 'jpg' || ext === 'svg') {
      block = { content: data, type: 'image' }
    }
    const key = (this.props.blocks.length - 1).toString()
    const layout = this.props.blocks.find(c => c.layout.i === 'upload').layout
    this.props.addCheckpoint()
    this.props.addBlock(JSON.parse(JSON.stringify({
      key,
      type: 'markdown',
      layout: { ...layout,
        i: key,
      },
      block,
    })))
  }

  onDrop = (accept) => {
    accept.forEach((f) => {
      const reader = new FileReader()
      const { name } = f
      const extension = (/[.]/.exec(name)) ? /[^.]+$/.exec(name)[0] : undefined
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (event) => {
        const fileAsBinaryString = reader.result;
        this.parseFile(fileAsBinaryString, extension)
      };
      if ((/(gif|jpg|jpeg|tiff|png)$/i).test(extension)) {
        reader.readAsDataURL(f);
      } else {
        reader.readAsBinaryString(f);
      }
    })
  }

  renderPlot = (l) => {
    const { layout, key, type, content, ...block } = l;
    console.log(l);
    if (type === 'upload') {
      let dropZoneRef
      return (
        <div key={layout.i} style={{ border: '2px solid #333', display: 'flex' }} onDoubleClick={() => {dropZoneRef.open()}}>
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
    } else if (type === 'markdown') {
      return (
        <div key={layout.i}>
          <div
            className="markdown"
            dangerouslySetInnerHTML={{__html: marked(content)}}
          />
        </div>
      )
    } else if (type === 'image') {
      return (
        <div key={layout.i}>
          <img className="image" src={content} />
        </div>
      )
    } else if (type === 'chart') {
      return (
        <div key={layout.i}>
          <Chart
            layout={layout}
            data={getPlotData(this.props.data, l)}
            width={layout.w}
            height={layout.h}
            handleLock={this.props.updateBlockStatic}
            removeBlock={this.removeBlock(layout.i)}
            setFullscreen={this.setFullscreen}
            editChart={() => {this.onEditorChange(Yaml.stringify(block))}}
          />
        </div>
      );
    }
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
    console.log('editor');
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
