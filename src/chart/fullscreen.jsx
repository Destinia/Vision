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


  render() {
    const { data, layout } = this.props.data
    const { size } = this.props
    return <div onClick={this.props.onClick}>
      <i className="material-icons close-btn" onClick={this.props.close}>
        close
        </i>
      <i className="material-icons edit-btn">edit</i>
      <Plot data={data} layout={{ ...layout, ...size }} config={{ displayModeBar: false }} style={{ position: "relative", zIndex: -100 }} />
    </div>;
  }
}

export default sizeMe({ monitorHeight: true })(Chart);
