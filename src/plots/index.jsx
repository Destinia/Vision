/* global Plotly:true */
import React, { Component } from 'react';

// import Select from 'react-select';
// import SplitPane from 'react-split-pane';

import Plot from 'react-plotly.js';
import sizeMe from 'react-sizeme'


class Chart extends Component {

	constructor(props) {
		super(props);

		const plotJSON = {
			data: [{
				x: [1, 2, 3, 4],
				y: [1, 3, 2, 6],
				type: 'bar',
				marker: { color: '#ab63fa' },
			}, {
				x: [1, 2, 3, 4],
				y: [3, 2, 7, 4],
				type: 'line',
				marker: { color: '#19d3f3' },
			}],
			layout: {
				plotBackground: '#f3f6fa',
        margin: { t: 50, r: 20, l: 30, b: 35 },
        title: 'Test Plot',
			}
		};

		this.state = {
			json: plotJSON,
			plotUrl: ''
		};
	}



	render() {
    const { data, layout } = this.props.data
    const size = { width: this.props.size.width, height: this.props.height*60-10 }
		return (
			<div style={{ width: 'inherit', height: 'inherit', zIndex: -10, padding: '0px' }}>
				<Plot
          data={data}
          layout={{ ...layout, ...size }}
          config={{ displayModeBar: false }}
          style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%' }}
				/>
			</div>
		);
	}
}

export default sizeMe()(Chart);