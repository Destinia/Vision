import React, { Component } from 'react';

import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme'
import * as Blocks from "./components";


import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const Fullscreen = ({ onClick, close, type, ...props }) =>  {
  // const layout = { ...data.layout,
  //   plot_bgcolor: 'white',
  //   paper_bgcolor: 'white',
  // };
  const BLockComp = Blocks[type];
  return <div onClick={onClick} className="block-container">
      <i className="material-icons close-btn" onClick={close}>
        close
      </i>
      <i className="material-icons edit-btn">edit</i>
      <BLockComp {...props} />
      {/* <Plot data={data.data} layout={{ ...layout, ...size }} config={{ displayModeBar: false }} style={{ position: "relative", zIndex: -100 }} /> */}
    </div>;
}

export default sizeMe({ monitorHeight: true })(Fullscreen);
