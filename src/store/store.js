import { createStore, compose } from 'redux'
import persistState from 'redux-localstorage'
import checkpointEnhancer from './checkpointEnhancer'

export default function configureStore(rootReducer, ...enhancers) {
  const createStoreWithEnhancers = compose(
    ...enhancers,
    checkpointEnhancer({
      path: 'blocks',
    }),
    persistState('blocks'),
  )(createStore)
  return createStoreWithEnhancers(rootReducer)
}
