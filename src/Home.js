import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Layout from './Layout'
import Plot from './plots'
import './App.css'


const enhance = compose(
  connect(
    ({ connector }) => ({
      data: connector.data ? Object.values(connector.data) : [],
    })
  ),
)

const Home = ({ data }) => (
  <div className='App'>
    <div className='App-header'>
      <h2>firestore demo</h2>
    </div>
    <Layout data={data} />
  </div>
)

Home.propTypes = {
  todos: PropTypes.array
}

export default enhance(Home)
