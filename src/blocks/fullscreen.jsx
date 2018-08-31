import React, { Component } from 'react';

import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme'


import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const Chart = ({ data, size, onClick, close }) =>  {
  const layout = { ...data.layout,
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
  };
  return <div onClick={onClick}>
    <i className="material-icons close-btn" onClick={close}>
      close
      </i>
    <i className="material-icons edit-btn">edit</i>
    <Plot data={data.data} layout={{ ...layout, ...size }} config={{ displayModeBar: false }} style={{ position: "relative", zIndex: -100 }} />
  </div>;
}

export default sizeMe({ monitorHeight: true })(Chart);
