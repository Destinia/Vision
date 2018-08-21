import React, { Component } from 'react';
import * as Blocks from './components'


import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

class Block extends Component {

  constructor(props) {
    super(props);

  }

  handleLockClick = () => {
    this.props.handleLock(this.props.layout.i)
  }

  handleFullscreen = () => {
    this.props.setFullscreen(this.props.layout.i)
  }

  render() {
    const { layout, removeBlock, setFullscreen, type, editBlock, ...props } = this.props
    console.log(props);
    const BLockComp = Blocks[type]

    // const size = { width: this.props.size.width, height: this.props.height*60-12 }
    return <div className="block-container product">
        <i className="material-icons lock-btn" onClick={this.handleLockClick}>
          {layout.static ? "lock" : "lock_open"}
        </i>
        <i className="material-icons close-btn" onClick={removeBlock}>
          close
        </i>
        <i className="material-icons fullscreen-btn" onClick={this.handleFullscreen}>fullscreen</i>
        {(editBlock) ? <i className="material-icons edit-btn" onClick={editBlock}>edit</i> : null}
        <BLockComp {...props} />
        {/* <Chart data={data} height={this.props.height} /> */}
        {/* <Image data={data} /> */}
        {/* <Upload /> */}
      </div>;
  }
}

export default Block;
