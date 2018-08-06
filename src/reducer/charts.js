const defaultChartState = {
  0: { layout: {i: 0} , a: 1}
}

export default (state = defaultChartState, action) => {
  switch (action.type) {
    case 'ADD_CHART':
      return {
      ...state,
      [action.key]: {
        layout: action.layout,
        ...action.chart,
      },
    }

    case 'REMOVE_CHART': {
      const newState = {}

      for (const key of Object.keys(state)) {
        if (key === action.key) continue
        newState[key] = state[key]
      }

      return newState
    }

    case 'UPDATE_CHART_LAYOUT': {
      const newState = {}
      for (const layout of action.layouts) {
        if (!state.hasOwnProperty(layout.i)) continue

        newState[layout.i] = {
          ...state[layout.i],
          layout,
        }
      }

      return newState
    }

    case 'UPDATE_CHART_SCHEMA': {
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

    case 'OVERWRITE_CHARTS':
      return action.charts

    default:
      return state
  }
}
