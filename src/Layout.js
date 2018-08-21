import React from "react";
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Responsive, WidthProvider } from "react-grid-layout";
import Dropzone from 'react-dropzone'
import fileSaver from 'file-saver'
import marked from 'marked'
import * as actions from './action'
import { addCheckpoint } from './store/checkpointEnhancer'
import Block from './blocks'
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

  setBlockFullscreen = (key) => () => {
    this.setState({ fullscreen: key })
  }

  handleBlockLock = (key) => () => {
    this.props.updateBlockStatic(key)
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
      if (!isLayoutsEqual(this.props.blocks.map(c => c.layout), layouts))
        this.props.addCheckpoint()
      this.props.updateBlockLayouts(JSON.parse(JSON.stringify(layouts)))
    }
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

  getBlockProps = (block) => {
    const { layout, type, key, content, ...info } = block
    switch (type) {
      case 'upload':
        return {
          onDrop: this.onDrop,
        }
      case 'chart':
        return {
          height: layout.h*(this.props.rowHeight+10)-12,
          data: getPlotData(this.props.data, block),
          editBlock: () => {this.onEditorChange(Yaml.stringify({ key, ...info }))}
        }
      case 'markdown':
        return {
          data: content,
        }
      case 'image':
        return {
          data: content,
        }
      default:
        return {}
    }
  }

  renderPlot = (l) => {
    const { layout, type, key } = l;
    return (
      <div key={key}>
        <Block
          layout={layout}
          type={type}
          handleLock={this.handleBlockLock(key)}
          removeBlock={this.removeBlock(key)}
          setFullscreen={this.setBlockFullscreen(key)}
          {...this.getBlockProps(l)}
        />
      </div>
    )
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
