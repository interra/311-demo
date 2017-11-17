import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import dashFromTest from './dashFromTest.json'

const history = createHistory()

class App extends Component {
  componentWillMount() {
    console.log('app will mount', config, this.props)

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

  componentDidMount() {
    console.log('app did mount', this.props)
  }

  componentWillUpdate() {
    console.log('app will update', this.props)
  }

  componentDidUpdate() {
    console.log('app did update', this.props)
  }
  
  render() {
    console.log('dash render', this.props)
    // parse JSONResponse data
    // map data to appropriate component
    const props = Object.assign(config, this.props)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="app-title">{"(O)pen(d)ata (V)isuals"}</h1>
        </header>
        <Dashboard {...props} history={history} />
      </div>
    )
  }
}

// API returns a flat array of component data
// Use data.components[n].componentKey -> component.key
// to map data to appropriate component
//
// need to build appropriate query from config
// need to map filter values onto query
const query = gql`{
  getComponents(
    components: [
      {
        type: "Nvd3Chart", 
        resourceHandle: "byServiceName", 
        componentKey: "chart-1",
        limit: 10,
        dataFields: [
          {
            field: "service_name",
            resourceHandle: "byServiceName", 
            fieldHandle: "x", 
            type: "STRING"
          }, 
          {
            field: "count", 
            resourceHandle: "byServiceName", 
            fieldHandle: "y", 
            type: "INTEGER"
          }
        ]
      },
      {
        type: "Nvd3Chart", 
        resourceHandle: "byServiceName", 
        componentKey: "chart-2",
        limit: 10,
        dataFields: [
          {
            field: "service_name",
            resourceHandle: "byServiceName", 
            fieldHandle: "x", 
            type: "STRING"
          }, 
          {
            field: "count", 
            resourceHandle: "byServiceName", 
            fieldHandle: "y", 
            type: "INTEGER"
          }
        ]
      }
    ]
  ) 
  
  { 
    type
    componentKey
    data {
      JSONResponse
      total_rows
      time
    }
  }
}`

  export default graphql(query)(App)
