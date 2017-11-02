import React, { Component } from 'react';
import Dashboard from './Dashboard.js'
import config from './config.json'
import _dashObject from './dashFromTest.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'

const history = createHistory()

class App extends Component {
  componentWillMount() {
    console.log('dash will mount')
    const unlisten = history.listen((location, action) => {
      console.log('history listen', location, action)
      this.handleUpdate(location, action)
    })
    const params = (history.search) ? queryString.parse(history.search, {arrayFormat: 'bracket'}) : {}
    this.fetchDashboard(params)
  }
  
  handleUpdate(history) {
    const params = (history.search) ? queryString.parse(history.search, {arrayFormat: 'bracket'}) : {}
    this.forceUpdate()
    this.fetchDashboard(params)
    console.log('handleUpdate', params, history)
  }
  
  fetchDashboard(params) {
     const request = Object.assign({appliedFilters: params}, config)
     console.log('req',request)
     
     fetch('http://localhost:4000/dashboard', {
        method: "post",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json, text/html",        }
     }).then(data => {
        console.log('data', data)
        return data.json()
     }).then(dashObject => {
        console.log('json', dashObject)
       this.dashObject = Object.assign({history: history}, dashObject)
       this.forceUpdate()
      }
    ).catch(err => {
      console.log('Error on fetch', err)
    })
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{"(O)pen(d)ata (V)isuals"}</h1>
        </header>
        <Dashboard {...this.dashObject} />
      </div>
    )
  }
}

export default App;
