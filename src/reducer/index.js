import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { connectorReducer } from '../connectors'
import blockReducer from './blocks'
import editorReducer from './editor'

/*
import PropTypes as PT from 'prop-types'

const Name = PT.string
const Source = PT.exact({
  name: Name.isRequired,
  type: ChartType.isRequired,
})
const Time = PT.number
const TimeLength = PT.number
const Value = PT.oneOfType([
  PT.number, PT.string,
])
const ChartType = PT.oneOf([
  'bar', 'histogram', 'line', 'pie', 'scatter', 'gauge',
])
const Layout = PT.exact({
  x: PT.number.isRequired,
  y: PT.number.isRequired,
  w: PT.number.isRequired,
  h: PT.number.isRequired,
  i: PT.string.isRequired,
})

rootState.propTypes = {
  connector: PT.shape({
    status: PT.exact({
      requested: PT.boolean.isRequired,
      requesting: PT.boolean.isRequired,
      timestamps: PT.number.isRequired,
    }).isRequired,
    data: PT.exact({
      name: Name.isRequired,
      values: PT.arrayOf(Value).isRequired,
    }),
  }).isRequired,
  charts: PT.objectOf(PT.shape({
    layout: PT.objectOf(Layout).isRequired,
    title: PT.string.isRequired,
    description: PT.string,
    sources: PT.arrayOf(Source).isRequired,
    start: Time.isRequired,
    end: Time,
    segment: TimeLength,
    agg_func: PT.string,
  })).isRequired,
}
*/

const rootReducer = combineReducers({
  connector: connectorReducer,
  blocks: blockReducer,
  routing: routerReducer,
  editor: editorReducer,
})


export default rootReducer
