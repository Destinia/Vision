import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { Home, Preview, Product } from './Home'

export default (
  <Route path="/">
    <IndexRoute component={Home} />
    <Route path="preview" component={Preview} />
    <Route path="prod" component={Product} />
  </Route>
)
