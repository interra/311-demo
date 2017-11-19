import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
console.log('CONF 1', config)

const history = createHistory()

class App extends Component {
  
  componentDidMount() {
    // subscribe to query update
    history.listen((location, action) => {
      this.forceUpdate()
      this.props.data.refetch(graphqlQueryVars())
    })
  }

  render() {
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

const getDashFilters = () => {
  const filterRegion = config.regions.filter(region => region.id === "filters")
  if (filterRegion.length == 1) {
    return filterRegion[0].children
  } else {
    return []
  }
}

// A flat array of all of the dashboards components from config
const getDashComponents = () => {
  const regions = config.regions.filter(region => region.id !== "filters")
	const components = regions.reduce((acc, region) => {
		return acc.concat(region.children)
	}, [])

  console.log('gdc config', config)
  console.log('gdc', components)

  return components
}

// do any pre-fetch processing of component definits here
const prefetchProcessDashComponents = (_components, params) => {
  // @@TODO apply filter variables
  console.log('pfdc', params)
  const components = _components.map(component => {
    delete component.data
    return Object.assign(component, params, {componentKey: component.key})
  })

  console.log('ccc', components)
  
  return components
}

// generate qraphql query vars from app config and
// user supplied filter values
const graphqlQueryVars = () => { 
    // @@TODO params should be assigned based on config filter definitions
    const params = getParams()
    const filters = getDashFilters()
    console.log("FF",filters)
    const _components = getDashComponents()
    console.log('_CC', _components)
    const CC = prefetchProcessDashComponents(_components, params).slice(-1)
    console.log('CC', CC)
    const variables = {
      components: CC
    }

    const limit = (params && params.start_date) ? parseInt(params.start_date[0]) : 4 // configure default filter values
    const _variables = {

    // @@TODO this should be built from the config regions
    components: [
      {
        type: "Nvd3Chart", 
        resourceHandle: "byServiceName", 
        componentKey: "chart-2",
        limit: limit,
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
        limit: limit,
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
  }


  return _variables
}

const getParams = () => {
  const params = (history.location.search) ? queryString.parse(history.location.search, {arrayFormat: 'bracket'}) : {}
  return params
}

console.log("CONFIG", config)

export default graphql(query, { options : { variables : graphqlQueryVars() }})(App)
