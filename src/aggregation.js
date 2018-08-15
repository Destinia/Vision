import _ from 'lodash'

export const aggregatePeriod = (type, seg, data) => {
  if (seg === 'all') {
    seg = data.length
  }
  const chunkData = _.chunk(data, seg)
  switch ((type || '').toUpperCase()) {
    case 'SUM': {
        return chunkData.map(d => ({
          timestamp: d[Math.floor(d.length / 2)].timestamp,
          value: _.sumBy(d, (o) => o.value)
        }))
    }

    case 'AVG': {
      return chunkData.map(d => ({
        timestamp: d[Math.floor(d.length / 2)].timestamp,
        value: _.sumBy(d, (o) => o.value)/d.length
      }))
    }
    case 'MED': {
      return chunkData.map(d => ({
        timestamp: d[Math.floor(d.length / 2)].timestamp,
        value: d[Math.floor(d.length / 2)].value,
      }))
    }
    default:
      return data
  }
}
