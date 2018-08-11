import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Layout from './Layout'
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
    <Layout data={data} />
  </div>
)

Home.propTypes = {
  todos: PropTypes.array
}

export default enhance(Home)
