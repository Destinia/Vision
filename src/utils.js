import moment from 'moment';
import { saveAs } from 'file-saver/FileSaver'

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
  const { values } = data
  const start = values.findIndex(d => moment.unix(d.timestamp).isSameOrAfter(startTime))
  let end = values.findIndex(d => moment.unix(d.timestamp).isAfter(endTime))
  if (end === -1) {
    end = values.length
  }
  const periodData = values.slice(start, end)
  if (periodData.length) {
    const firstTime = periodData[0].timestamp
    return {
      x: periodData.map(d => d.timestamp - firstTime), y: periodData.map(d => d.value)
    }
  }
  return {x: [], y: []}
}

export const getPlotData = (data, chart) => {
	const { sources, start_time, end_time, title } = chart
	const endTime = (end_time)? moment(end_time, 'YYYY-MM-DD HH:mm:ss') : moment()
  const startTime = moment(start_time, 'YYYY-MM-DD HH:mm:ss')
	const chartData = sources.map(({ name, type }) => ({
    ...selectPeriod(data[name] || { values : [] }, startTime, endTime),
    type,
    marker: defaultMarker,
  }))
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
