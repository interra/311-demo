import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const history = createHistory()

class App extends Component {
  componentWillMount() {
    console.log('dash will mount', config)
    const unlisten = history.listen((location, action) => {
      console.log('history listen', location, action)
      this.handleUpdate(location, action)
    })
    const params = (history.search) ? queryString.parse(history.search, {arrayFormat: 'bracket'}) : {}
  }
  
  handleUpdate(history) {
    const params = (history.search) ? queryString.parse(history.search, {arrayFormat: 'bracket'}) : {}
    this.forceUpdate()
    console.log('handleUpdate', params, history)
  }
  
  render() {
    console.log('DATA', this.props.data)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">{"(O)pen(d)ata (V)isuals"}</h1>
        </header>
        <Dashboard data={this.props.data }/>
      </div>
    )
  }
}

const query = gql`{
  getComponents(components: [{type: "Nvd3Chart", resourceHandle: "byServiceName", dataFields: [{field: "service_name", resourceHandle: "byServiceName", fieldHandle: "x", type: "STRING"}, {field: "count", resourceHandle: "byServiceName", fieldHandle: "y", type: "INTEGER"}]}]) { type }}`

  export default graphql(query)(App)
