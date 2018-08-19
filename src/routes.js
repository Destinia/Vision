import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Home from './Home'

export default (
  <Route path="/">
    <IndexRoute component={Home} />
  </Route>
)
