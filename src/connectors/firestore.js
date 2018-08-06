import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore' // make sure you add this for firestore
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { createStructuredSelector, createSelector } from 'reselect'

// Use symbolic link to link to the config in the root directory
import firebaseConfig from './firebase-config.json'

const DEFAULT_DATA = {
  values: [],
  type: 'number',
}


const connectorConfig = {
  collection: 'test-ianchen',
}

const collectionLookup = (obj, defaultValue) =>
  (obj || {})[connectorConfig.collection] || defaultValue

function getStatus({ status = {} }) {
  return {
    requesting: collectionLookup(status.requesting, false),
    requested: collectionLookup(status.requested, false),
    timestamps: collectionLookup(status.timestamps, 0),
  }
}

const getData = createSelector(
  x => collectionLookup(x.data, {}),
  (items) => {
    const ret = {}
    for (const item of Object.values(items)) {
      const { name, ...values } = item
      ret[name] = { ...DEFAULT_DATA, ...values }
    }
    return ret
  },
)

const getSchema = createSelector(
  getData,
  (data) => {
    const ret = {}
    for (const name of Object.keys(data)) {
      ret[name] = data[name].type || DEFAULT_DATA.type
    }

    return ret
  }
)

const dataSelector = createStructuredSelector({
  schema: getSchema,
  status: getStatus,
  data: getData,
})

// Internal state
let connectorState = undefined
export function connectorReducer(state, action) {
  connectorState = firestoreReducer(connectorState, action)
  return dataSelector(connectorState)
}

export function connectorEnhancer(config = {}) {
  Object.assign(connectorConfig, config)

  // Initialize Firebase instance
  firebase.initializeApp(firebaseConfig)
  // Initialize Firestore with timeshot settings
  firebase.firestore().settings({ timestampsInSnapshots: true })

  return createStore => (...args) => {
    const store = reduxFirestore(firebase, {
      enhancerNamespace: 'connector',
    })(createStore)(...args)

    store.firestore.onSnapshot({
      collection: connectorConfig.collection
    })
    return store
  }
}
