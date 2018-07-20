import { combineReducers } from 'redux'

import { connectorReducer } from './connectors/firestore'

const rootReducer = combineReducers({
  connector: connectorReducer,
})

export default rootReducer
