import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore' // make sure you add this for firestore
import { reduxFirestore, firestoreReducer } from 'redux-firestore'
import { createStructuredSelector } from 'reselect'

// Use symbolic link to link to the config in the root directory
import firebaseConfig from './firebase-config.json'

const connectorConfig = {
  collection: 'test-ianchen',
}

export function initializeConnector() {
  // Initialize Firebase instance
  firebase.initializeApp(firebaseConfig)
  // Initialize Firestore with timeshot settings
  firebase.firestore().settings({ timestampsInSnapshots: true })
}

function getConnectorKey(obj, val) {
  return connectorConfig.collection in obj ? obj[connectorConfig.collection] : val
}

function getStatus({ status }) {
  return {
    requesting: getConnectorKey(status.requesting),
    requested: getConnectorKey(status.requested),
    timestamps: getConnectorKey(status.timestamps),
  }
}

function getData({ data }) {
  return getConnectorKey(data)
}

const dataSelector = createStructuredSelector({
  schema: state => ({}),
  status: getStatus,
  data: getData,
})

// Internal state
let connectorState = undefined
export function connectorReducer(state, action) {
  connectorState = firestoreReducer(connectorState, action)
  return dataSelector(connectorState)
}

export function connectorEnhancer() {
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
