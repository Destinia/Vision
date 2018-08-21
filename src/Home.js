import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Layout from './Layout'
import NavBar from './NavBar'
import './App.css'


const Home = () => (
  <div className='App'>
    <NavBar />
    <Layout />
  </div>
)

export default Home
