import moment from 'moment';
import { saveAs } from 'file-saver/FileSaver'
import { aggregatePeriod } from './aggregation'

const defaultMarker = {
  color: '#19d3f3',
}

const defaultLayout = {
  plotBackground: '#f3f6fa',
  margin: {
    t: 50,
    r: 20,
    l: 30,
    b: 35
  },
  title: 'Test Plot',
}

const selectPeriod = (data, startTime, endTime) => {
  const start = data.findIndex(d => moment.unix(d.timestamp).isSameOrAfter(startTime))
  let end = data.findIndex(d => moment.unix(d.timestamp).isAfter(endTime))
  if (end === -1) {
    end = data.length
  }
  const periodData = data.slice(start, end)
  console.log(periodData);
  if (periodData.length) {
    const firstTime = periodData[0].timestamp
    return {
      x: periodData.map((d, i) => (i === 0) ? moment.unix(d.timestamp).format('YYYY-MM-DD HH:mm:ss') : d.timestamp - firstTime),
      y: periodData.map(d => d.value)
    }
  }
  return {x: [], y: []}
}

export const getPlotData = (data, chart) => {
	const {
	  sources,
	  start_time,
	  end_time,
	  title,
	  aggr_func,
    segment,
	} = chart
	const endTime = (end_time)? moment(end_time, 'YYYY-MM-DD HH:mm:ss') : moment()
  const startTime = moment(start_time, 'YYYY-MM-DD HH:mm:ss')
	const chartData = sources.map(({ name, type }) => {
    const aggrData = aggregatePeriod(aggr_func, segment, data[name].values)
    console.log(aggrData);
    return ({
      ...selectPeriod(aggrData || { values : [] }, startTime, endTime),
      type,
      marker: defaultMarker,
    })
  })
	return { data: chartData, layout: { ...defaultLayout, title }}
}

export const loadFile = (file, callback) => {
  const reader = new FileReader()
  reader.onload = evt => {
    const obj = JSON.parse(evt.target.result)
    callback(obj)
  }
  reader.readAsText(file)
}

export function exportFile(charts) {
  const blob = new Blob([JSON.stringify(charts)], {
    type: "application/json;charset=utf-8"
  })

  saveAs(blob, 'charts.json')
}
