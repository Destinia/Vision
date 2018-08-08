import YAML from 'js-yaml'

// YAML-formatted string -> Object
export function parseChart(s) {
  const obj = YAML.safeLoad(s)

  if (obj.end === 'now') delete obj.end

  return obj
}

// Object -> YAML-formatted string
export function stringifyChart(obj) {
  return YAML.safeDump(obj)
}

export function stringifyEnvironment(obj) {
  return JSON.stringify(obj)
}

export function parseEnvironment(s) {
  return JSON.parse(s)
}

export default {
  parseChart,
  stringifyChart,
  parseEnvironment,
  stringifyEnvironment,
}
