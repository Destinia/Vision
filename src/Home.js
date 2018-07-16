import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import {
  firestoreConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import './App.css'

const enhance = compose(
  firestoreConnect([
    // Load todos from Firestore which are not done into redux
    { collection: 'todos', where: ['done', '==', false] }
  ]),
  connect(
    ({ firestore }) => ({
      todos: firestore.ordered.todos,
    })
  ),
  withHandlers({
    addTodo: props => () =>
      props.firestore.add('todos', { text: 'sample', done: false })
  })
)

const Home = ({ firestore }) => (
  <div className='App'>
    <div className='App-header'>
      <h2>firestore demo</h2>
    </div>
  </div>
)

Home.propTypes = {
  firestore: PropTypes.shape({ // from enhnace (withFirestore)
    add: PropTypes.func.isRequired,
  }),
  addTodo: PropTypes.func.isRequired, // from enhance (withHandlers)
  todos: PropTypes.array
}

export default enhance(Home)
