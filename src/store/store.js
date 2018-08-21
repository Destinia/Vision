import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
// import createLogger from 'redux-logger'
import checkpointEnhancer from './checkpointEnhancer'

const router = routerMiddleware(browserHistory)
// const logger = createLogger({
//   level: 'info',
//   collapsed: true,
// });

export default function configureStore(rootReducer, ...enhancers) {
  const createStoreWithEnhancers = compose(
    ...enhancers,
    applyMiddleware(router),
    checkpointEnhancer({
      path: 'blocks',
    }),
    persistState('blocks'),
  )(createStore)
  return createStoreWithEnhancers(rootReducer)
}
