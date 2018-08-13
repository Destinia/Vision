const prefix = '@@checkpoint'
let path = ''

function shallowEqual(a = {}, b = {}) {
  for(const key in a) {
    if(!(key in b) || a[key] !== b[key]) { return false }
  }
  for(var key in b) {
    if(!(key in a) || a[key] !== b[key]) { return false }
  }
  return true
}

export default ({
  path: _path,
  limit = 5,
  key = 'checkpoint',
  equalFunc = shallowEqual,
}) => createStore => (reducer, initialState, enhancer) => {
    path = _path
    const defaultCPState = {
      history: [],
      current: -1,
    }
    const newReducer = (oldState, action) => {
      const { [key]: checkpoint, ...state } = oldState
      const { history: oldHistory, current } = checkpoint

      switch(action.type) {
        case `${prefix}/ADD_CHECKPOINT`: {
          // Keep [current - limit + 1, current] + obj
          const obj = state[path]
          const history = [ ...oldHistory.slice(Math.max(0, current + 1 - limit), current + 1), obj]
          return {
            ...state,
            [key]: {
              current: history.length - 1,
              history,
            }
          }
        }

        case `${prefix}/JUMP_CHECKPOINT`: {
          const current = Math.max(0, Math.min(oldHistory.length - 1, checkpoint.current + action.step))
          return {
            ...state,
            [path]: oldHistory[current],
            [key]: {
              ...checkpoint,
              current,
            }
          }
        }

        default: {
          const newState = reducer(state, action)
          if (equalFunc(oldHistory[current], newState[path])) {
            // No state change
            return {
              [key]: checkpoint,
              ...newState,
            }
          }

          const obj = newState[path]
          let history

          if (oldHistory.length - current !== 1) {
            // Not point to the last element
            // Keep [current - limit + 1, current] + obj
            history = [ ...oldHistory.slice(Math.max(0, current + 1 - limit), current + 1), obj]
          } else {
            // Point to the last element
            // Keep [0, current - 1] + obj
            history = [ ...oldHistory.slice(0, current), obj]
          }

          return {
            ...newState,
            [key]: {
              current: history.length - 1,
              history,
            }
          }
        }
      }
    }

    return createStore(newReducer, { ...initialState, [key]: defaultCPState }, enhancer)
}

export const addCheckpoint = () => ({
  type: `${prefix}/ADD_CHECKPOINT`,
  path,
})

export const jumpCheckpoint = (step = -1) => ({
  type: `${prefix}/JUMP_CHECKPOINT`,
  path,
  step,
})
