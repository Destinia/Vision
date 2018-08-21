import { createStore, compose, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger'
import checkpointEnhancer from './checkpointEnhancer'

const router = routerMiddleware(browserHistory)
const logger = createLogger({
  level: 'info',
  collapsed: true,
});

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
    applyMiddleware(router, logger),
    checkpointEnhancer({
      path: 'blocks',
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
