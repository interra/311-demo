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
    history.listen((location, action) => {
      this.forceUpdate()
    })

    console.log('app will mount', config, this.props)
  }
  
  handleUpdate(location) {
    console.log("hU0", history)
    
    const params = (location.search) ? queryString.parse(location.search, {arrayFormat: 'bracket'}) : {}
    console.log('hU1', params, history)
  }

  componentDidMount() {
    console.log('app did mount', this.props)
  }

  componentWillUpdate() {
    const params = (history.location.search) ? queryString.parse(history.location.search, {arrayFormat: 'bracket'}) : {}
    console.log('app will update', this.props, params)
  }

  componentDidUpdate() {
    console.log('app did update', this.props)
  }
  
  render() {
    console.log('dash render', this.props)
    const params = (history.location.search) ? queryString.parse(history.location.search, {arrayFormat: 'bracket'}) : {}
    console.log("PR", history, params)
    // parse JSONResponse data
    // map data to appropriate component
    const props = Object.assign(config, this.props, {appliedFilters: params})
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
// @@NOTE the approach here seems to be to use graphql query 
// @@NOTE variables and to 
const query = gql`
  query getComponents ($components: [ComponentInput]!) {
  getComponents(
    components: $components
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
  }
`

export default graphql(query, { options : { variables : {
    components: [
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
      },
      {
        type: "Nvd3Chart", 
        resourceHandle: "byServiceName", 
        componentKey: "chart-1",
        limit: 30,
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
  }}})(App)
