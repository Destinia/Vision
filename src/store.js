import { createStore, compose } from 'redux'
import rootReducer from './reducer'
import { connectorEnhancer } from './connectors/firestore'

function devToolsEnhancer() {
  if (typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined') {
    return window.devToolsExtension()
  }

  return f => f
}

export default function configureStore() {
  const createStoreWithMiddleware = compose(
    connectorEnhancer(),
    devToolsEnhancer(), // Make sure it's at the bottom of the enhancer list.
  )(createStore)

  const store = createStoreWithMiddleware(rootReducer)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
