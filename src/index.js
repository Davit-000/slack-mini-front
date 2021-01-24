import React from 'react'
import Cookies from "js-cookie"
import ReactDOM from "react-dom"
import {createStore} from "redux"
import {Provider} from "react-redux"
import reducers from "./reducers"
import {login} from "./actions"
import api from "./api"
import App from "./App"

const store = createStore(reducers)
const localToken = Cookies.get('token')

if (localToken) {
  store.dispatch(login(localToken))
  api.defaults.headers.common['Authorization'] = localToken
}

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
