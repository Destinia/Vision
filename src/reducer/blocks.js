const defaultBlockState = {
  'upload': {
    type: 'upload',
    layout: {
      i: 'upload',
      x: 0,
      y: 0,
      w: 3,
      h: 3,
      minW: 3,
      minH: 3,
      moved: false,
      static: false,
    },
    block: {},
  }
}

export default (state = defaultBlockState, action) => {
  switch (action.type) {
    case 'ADD_BLOCK':
      return {
      ...state,
      [action.key]: {
        layout: action.layout,
        ...action.block,
      },
    }

    case 'REMOVE_BLOCK': {
      const newState = {}

      for (const key of Object.keys(state)) {
        if (key === action.key) continue
        newState[key] = state[key]
      }

      return newState
    }

    case 'UPDATE_BLOCK_LAYOUT': {
      const newState = {}
      for (const layout of action.layouts) {
        if (!state.hasOwnProperty(layout.i)) continue

        newState[layout.i] = {
          ...state[layout.i],
          layout: JSON.parse(JSON.stringify(layout)),
        }
      }

      return newState
    }

    case 'UPDATE_BLOCK_STATIC': {
      if (!state.hasOwnProperty(action.key)) return state
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          layout: { ...state[action.key].layout,
            static: !state[action.key].layout.static,
          }
        }
      }
    }

    case 'UPDATE_BLOCK_SCHEMA': {
      if (!state.hasOwnProperty(action.key)) return state

      const newState = {
        ...state,
        [action.key]: {
          ...action.schema,
          layout: state[action.key].layout,
        },
      }

      return newState
    }

    case 'OVERWRITE_BLOCKS':
      return action.blocks

    case 'CLEAR_BLOCKS':
      return defaultBlockState

    default:
      return state
  }
}
