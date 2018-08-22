import moment from 'moment';
import { saveAs } from 'file-saver/FileSaver'
import css from 'css'
import { aggregatePeriod } from './aggregation'
import _ from 'lodash'

const defaultMarker = {
  color: '#19d3f3',
}

const defaultLayout = {
  plot_bgcolor: 'rgba(0,0,0,0)',
  paper_bgcolor: 'rgba(0,0,0,0)',
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

export const isLayoutsEqual = (a, b) => {
  const objA = a.reduce((acc, cur) => ({ ...acc, [cur.i]: cur }), {})
  const objB = b.reduce((acc, cur) => ({ ...acc, [cur.i]: cur }), {})
  const keyA = Object.keys(objA)
  const keyB = Object.keys(objB)
  keyA.sort()
  keyB.sort()
  if (!_.isEqual(keyA, keyB))
    return false
  return keyA.every(k => isLayoutEqual(objA[k], objB[k]))

}

const requiredKeys = ['x', 'y', 'h', 'w', 'i', 'static']

const isLayoutEqual = (a, b) => {
  return requiredKeys.every(k => a[k] === b[k])
}

export const addStylePrefix = (content, prefix) => {
  return content.replace(/<style>([\s\S]+?)<\/style>/gm, (match) => {
    console.log(match.replace(/<style>/, '').replace(/<\/style>/, ''))
    const styles = css.parse(match.replace(/<style>/, '').replace(/<\/style>/,''))
    const rules = styles.stylesheet.rules.map(r => ({ ...r,
      selectors: r.selectors.map(s => `${prefix}${s}`)
    }))
    const newStyle = { ...styles, stylesheet: { ...styles.stylesheet, rules }}
    console.log();
    return `<style>\n${css.stringify(newStyle)}\n</style>`
  })
}
