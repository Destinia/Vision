// Alert system
//
// The alert system can be used with pub-sub and/or callback mechanism.
//
// 1. Each time there's a change in the message pool, all subscribers will be
//    notified with a list of messages sorted by the time added to the message
//    pool.
//
// 2. If alert is called with callback provided, the callback will be called
//    when the message is removed.
//
// If alert is called with persistSeconds specified, the message will be
// automatically removed after N seconds.

const ALERTS = new Map()
const SUBSCRIBER = new Map()

export const LEVEL = new Set(['success', 'info', 'warning', 'error'])

let counter = 0
export function subscribe(func) {
  SUBSCRIBER.set(counter, func)
  counter += 1

  const key = counter
  return () => {
    if SUBSCRIBER.has(key) {
      SUBSCRIBER.delete(key)
    }
  }
}

export function unsubscribe(func) {
  for (const [key, f] of  SUBSCRIBER) {
    if (f === func) SUBSCRIBER.delete(key)
  }
}

function dataCompare(a, b) {
  if (a.key < b.key) return -1
  else if (a.key > b.key) return 1
  return 0
}

function notify() {
  const messages = []
  for (const value of ALERTS.values()) {
    messages.push(value)
  }

  messages.sort(dataCompare)

  for (const func of SUBSCRIBER.values()) {
    func(messages)
  }
}

export function cancel(key) {
  if (ALERTS.has(key)) {
    const { payload, callback } = ALERTS.get(key)
    if (callback) callback(key, payload)

    ALERTS.delete(key)
    notify()
  }
}

// Variations
// alert(level, payload, callback)
// alert(level, payload, callback, persistSeconds)
// alert(level, payload, persistSeconds)
export function alert(level, payload, callback = null, persistSeconds = 0) {
  if (!LEVEL.has(level)) return -1

    if (callback !== null && !Number.isNaN(+callback)) {
      persistSeconds = callback
      callback = null
    }

    const key = new Date().getTime().toString()
    const data = {
      key,
      level,
      payload,
      callback,
    }

    ALERTS.set(key, data)

    if (persistSeconds !== 0) {
      setTimeout(
        () => cancel(key),
          persistSeconds * 1000,
      )
    }
    notify()

    return key
}

export const alertSuccess = alert.bind(null, 'success')
export const alertWarning = alert.bind(null, 'warning')
export const alertError = alert.bind(null, 'error')
export const alertInfo = alert.bind(null, 'info')
