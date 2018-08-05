import { combineReducers } from 'redux'

import { connectorReducer } from './connectors/firestore'

// import PropTypes as PT from 'prop-types'
// const Name = PT.string
// const Time = PT.number
// const TimeLength = PT.number
// const ValueType = PT.oneOfType([
//   PT.number, PT.string,
// ])
// const ChartType = PT.oneOf([
//   'bar', 'histogram', 'line', 'pie', 'scatter', 'gauge',
// ])
// const Layout = PT.exact({
//   x: PT.number.isRequired,
//   y: PT.number.isRequired,
//   w: PT.number.isRequired,
//   h: PT.number.isRequired,
//   i: PT.string.isRequired,
// })
//
// rootState.propTypes = {
//   connector: PT.shape({
//     schema: PT.objectOf(ValueType).isRequired,
//     status: PT.exact({
//       requested: PT.boolean.isRequired,
//       requesting: PT.boolean.isRequired,
//       timestamps: PT.number.isRequired,
//     }).isRequired,
//     data: PT.exact({
//       name: Name.isRequired,
//       values: PT.arrayOf(ValueType).isRequired,
//     }),
//   }).isRequired,
//   charts: PT.arrayOf(PT.shape({
//     layout: PT.objectOf(Layout).isRequired,
//     title: PT.string.isRequired,
//     description: PT.string,
//     sources: PT.arrayOf(Name).isRequired,
//     start: Time.isRequired,
//     end: Time,
//     segment: PT.arrayOf(TimeLength),
//     agg_func: PT.string,
//     type: ChartType.isRequired,
//   })).isRequired,
// }

const defaultChartState = []
const chartReducer = (state = defaultChartState, action) => {
  switch (action.type) {
    case 'UPDATE_LAYOUT': // TODO: 1). copy state 2). replace layout
    case 'UPDATE_CHART_CONTENT': // TODO: 1). copy state 2). replace chart
      return state
    default:
      return state
  }
}

const rootReducer = combineReducers({
  connector: connectorReducer,
  charts: chartReducer,
})

export default rootReducer
