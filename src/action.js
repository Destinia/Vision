export const addChart = ({key, layout, chart}) => ({
  type: 'ADD_CHART',
  key,
  layout,
  chart,
})

export const removeChart = key => ({
  type: 'REMOVE_CHART',
  key,
})

export const updateChartLayouts = layouts => ({
  type: 'UPDATE_CHART_LAYOUT',
  layouts,
})

export const updateChartSchema = (key, schema) => ({
  type: 'UPDATE_CHART_SCHEMA',
  key,
  schema,
})

export const overwriteChart = charts => ({
  type: 'OVERWRITE_CHARTS',
  charts,
})
