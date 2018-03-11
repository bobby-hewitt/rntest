/*import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

import App from './App'

function configureStore(initialState){
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware
    )
  )
  return createStore(reducer, initialState, enhancer)
}

const store = configureStore({
  //provide initial state here
})

export default class AppConfig extends Component<{}> {
  render(){
    return(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}
*/


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'

import thunkMiddleware from 'redux-thunk'
import reducer from './reducers'

import App from './App'

function configureStore(initialState){
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware
    )
  )
  const persistConfig = {
    key: 'root',
    storage,
  }

  const persistedReducer = persistReducer(persistConfig, reducer)
  let store = createStore(persistedReducer, initialState, enhancer)
  let persistor = persistStore(store)
  return {store, persistor}
}

const store = configureStore({})

export default class AppConfig extends Component<{}> {
  render(){
    return(
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <App />
        </PersistGate>
      </Provider>
    )
  }
}


