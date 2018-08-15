import React, { Component } from 'react';

import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme'


import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

class Chart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locked: false,
    };
  }

  handleLockClick = () => {
    console.log(this.props, this.props.layout.i, !this.state.locked);
    this.props.handleLock(this.props.layout.i, !this.state.locked)
    this.setState({ locked: !this.state.locked })
  }

  handleFullscreen = () => {
    this.props.setFullscreen(this.props.layout.i)
  }

  render() {
    const { data, layout } = this.props.data

    const size = { width: this.props.size.width, height: this.props.height*60-12 }
    return <div>
        <i className="material-icons lock-btn" onClick={this.handleLockClick}>
          {this.state.locked ? "lock" : "lock_open"}
        </i>
        <i className="material-icons close-btn" onClick={this.props.removeChart}>
          close
        </i>
        <i className="material-icons fullscreen-btn" onClick={this.handleFullscreen}>fullscreen</i>
        <i className="material-icons edit-btn" onClick={this.props.editChart}>edit</i>
        <Plot data={data} layout={{ ...layout, ...size }} config={{ displayModeBar: false }} style={{ position: "relative", display: "inline-block", width: "100%", height: "100%", zIndex: -100 }} />
      </div>;
  }
}

export default sizeMe()(Chart);
