import React from 'react'
import Layout from './Layout'
import NavBar from './NavBar'


export const Home = () => (
  <div className='App'>
    <NavBar />
    <Layout />
  </div>
)

export const Preview = () => (
  <div className='App'>
    <NavBar />
    <Layout product />
  </div>
)

export const Product = () => (
  <div className='App'>
    <Layout product />
  </div>
)
