import React from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Home from './Home'
import configureStore from './store'

import rootReducer from './reducer'
import routes from './routes'

// the connector is specified in ./connectors/index.js
import { connectorEnhancer } from './connectors'

import './App.css'

const store = configureStore(
  rootReducer,
  connectorEnhancer(),
)

const history = syncHistoryWithStore(browserHistory, store)

export default () => (
  <Provider store={store}>
    <Router
      routes={routes}
      history={history}
    />
  </Provider>
)
