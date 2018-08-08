import YAML from 'js-yaml'

// (JSON/TOML)-formatted string -> Object
export function parse(s, format = 'json') {
  if (format === 'yaml') {
    // TODO: post-parsing procedures
    return YAML.safeLoad(s)
  }
  return JSON.parse(s)
}

// Object -> (JSON/TOML)-formatted string
export function stringify(obj, format = 'json') {
  if (format === 'yaml') {
    // TODO: post-stringify procedures
    return YAML.safeDump(obj)
  }
  return JSON.stringify(obj)
}

export default {
  parse,
  stringify,
}
