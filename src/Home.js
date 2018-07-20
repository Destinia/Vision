import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import './App.css'

const enhance = compose(
  connect(
    ({ connector }) => ({
      todos: connector.data ? Object.keys(connector.data) : [],
    })
  ),
)

const Home = ({ todos }) => (
  <div className='App'>
    <div className='App-header'>
      <h2>firestore demo</h2>
        { todos.map(x => <p key={x}>{x}</p>) }
    </div>
  </div>
)

Home.propTypes = {
  todos: PropTypes.array
}

export default enhance(Home)
