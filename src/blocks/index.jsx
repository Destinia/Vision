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
    const { layout, removeBlock, handleLock, setFullscreen, type, editBlock, product, ...props } = this.props;
    const BLockComp = Blocks[type]

    // const size = { width: this.props.size.width, height: this.props.height*60-12 }
    return <div className={`block-container ${product? 'product':''}`}>
        <i className="material-icons lock-btn" onClick={handleLock}>
          {layout.static ? "lock" : "lock_open"}
        </i>
        <i className="material-icons close-btn" onClick={removeBlock}>
          close
        </i>
        {(type !== 'upload') ? <i className="material-icons fullscreen-btn" onClick={this.handleFullscreen}>fullscreen</i>:null}
        {(editBlock) ? <i className="material-icons edit-btn" onClick={editBlock}>edit</i> : null}
        <BLockComp {...props} id={`${type}${layout.i}`} />
      </div>;
  }
}

export default Block;
