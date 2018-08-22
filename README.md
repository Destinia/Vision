# Vision

An easy-to-use, configurable visualization dashboard

## Quick Start

1. After cloning the repository, run `npm install`.
2. Run `npm run start` to start developing.
3. Run `npm run build --production` to save production build in `/build`.


## Implementation Details

### Grid System

> Implmented in `src/Layout.js`

We use [STRML/react-grid-layout](https://github.com/STRML/react-grid-layout)  for the layout functionality. The state of layout is stored in redux store.

### Preview & Production Mode

> Implemented in `src/route.js`

We use `react-router` to manage browser routing state. Each mode corresponds to one route.

### Connector

> Implemented in `src/connector/*`

A connector should expose two function: `connectorEnhancer` and `connectorReducer`.

#### `connectorReducer`

The reducer has the interface `(state, action) -> state` that defines the shape of the data store as well as the connection status. It should (at least) have the following structure:

```javascript
{
  schema: {
    [key]: String, // The type of the "key" data in String format.
  },
  status: {
    requesting: boolean,
    requested: boolean,
    timestamps: number,
  },
  data: {
    [key]: {
      values: [],
    }
  },
}
```

#### `connectorEnhancer`

It should be a function receiving a config object and returning the real enhancer. Inside the enhancer, backend connection is established, and an attribute is added to the main store. The content of the attribute is controlled/processed by `connectorReducer`.

### Checkpoint (a.k.a. undo/redo)

> Implemented in `src/store/checkpointEnhancer.js`

We implement a redux enhancer that watch for changes on an attribute of the store. The enhancer also adds an attribute (default to `checkpoint`) to the store and expose two actions `addCheckpoint` and `jumpCheckpoint` to manipute the checkpoint state.

The creation of `checkpointEnhancer` can optionally accept a config object with the folloing attributes:

* path: the attribute to watch for in the store.
* limit: the maximum number of stored checkpoints.
* key: the name of the attribute that is added to the store.
* equalFunc: the function that determines whether state changed when the last action came in.

### Chart Drawing
> Implemented in `src/blocks/Chart.js`

[React Plotly](https://github.com/plotly/react-plotly.js)


### Block Component

> Implemented in `src/blocks/components/`

There can be many kinds of block elements in the layout. Each block object has an attribute `type` to specify the type of the block. All block component types are defined in `src/blocks/components/index.jsx` and used in `src/blocks/index.jsx`.

### LocalStorage

> Implemented in `src/store/store.js`

We use [elgerlambert/redux-localstorage](https://github.com/elgerlambert/redux-localstorage) to synchronize LocalStorage state witl current block contents. (This feature is only enabled in production build)

### Test Backend

> Implemented in `src/test-backend`

This is used to generate fake data, so one can easily debug the dashboard. Currently only Firebase backend is supported.

### Icons

> Assets can be found in `src/icons`

Downloaded from [iconmoon.io](http://icomoon.io/). We modify the content of `style.css` for styles when icons are hovered and disable styles.
