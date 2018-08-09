import { createStore, compose } from 'redux'
import persistState from 'redux-localstorage'

import rootReducer from '../reducer'

export default function configureStore(rootReducer, ...enhancers) {
  const createStoreWithMiddleware = compose(
    ...enhancers,
    persistState('charts'),
  )(createStore)
  return createStoreWithMiddleware(rootReducer)
}
