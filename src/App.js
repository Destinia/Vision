import React from 'react'
import { Provider } from 'react-redux'

import Home from './Home'
import configureStore from './store'
import { initializeConnector } from './connectors/firestore'

import './App.css'

initializeConnector()
const store = configureStore()

window.store = store

export default () => (
  <Provider store={store}>
    <Home />
  </Provider>
)
