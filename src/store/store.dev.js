import { createStore, compose } from 'redux'
import checkpointEnhancer from './checkpointEnhancer'

function devToolsEnhancer() {
  if (typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined') {
    return window.devToolsExtension()
  }

  return f => f
}

export default function configureStore(rootReducer, ...enhancers) {
  const createStoreWithEnhancers = compose(
    ...enhancers,
    checkpointEnhancer({
      path: 'charts',
    }),
    devToolsEnhancer(), // Make sure it's at the bottom of the enhancer list.
  )(createStore)

  const store = createStoreWithEnhancers(rootReducer)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextRootReducer = require('../reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  window.store = store

  return store
}
