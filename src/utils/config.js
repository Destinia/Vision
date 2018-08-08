import TOML from 'toml'
import tomlify from 'tomlify-j0.4'

// (JSON/TOML)-formatted string -> Object
export function parse(s) {
  return TOML.parse(s)
  if (format === 'toml') {
    // TODO: post-parsing procedures
    return TOML.parse(obj)
  }
  return JSON.parse(obj)
}

// Object -> (JSON/TOML)-formatted string
export function stringify(obj, format = 'json') {
  if (format === 'toml') {
    // TODO: post-stringify procedures
    return tomlify.toToml(obj, { space: 2 })
  }
  return JSON.stringify(obj)
}

export default {
  parse,
  stringify,
}
