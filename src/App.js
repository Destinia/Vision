import React from 'react'
import { Provider } from 'react-redux'

import Home from './Home'
import configureStore from './store'

import rootReducer from './reducer'

// the connector is specified in ./connectors/index.js
import { connectorEnhancer } from './connectors'

import './App.css'

const store = configureStore(
  rootReducer,
  connectorEnhancer(),
)

export default () => (
  <Provider store={store}>
    <Home />
  </Provider>
)
