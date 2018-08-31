import React, { Component } from "react";
import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme'

const Chart = sizeMe()(({ data, size, height }) => (
  <Plot
    data={data.data}
    layout={{ ...data.layout, ...size, height }}
    config={{ displayModeBar: false }}
    style={{
      position: "relative",
      display: "inline-block",
      width: "100%",
      height: "100%",
      zIndex: -100
    }}
  />
));

export default Chart
