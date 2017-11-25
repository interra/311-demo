import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FontAwesome from 'react-fontawesome'

const history = createHistory()

class App extends Component {
  componentDidMount() {
    // subscribe to query update
    history.listen((location, action) => {
      console.log('history-update', location, action, this)
      this.props.data.refetch(graphqlQueryVars())
      this.forceUpdate()
    })
  }

  render() {
    const props = Object.assign(config, this.props, {params: getParams(), history: history})
    
    return (
      <div id="app-container">
        <h1>{props.title}</h1>
        <Dashboard {...props} />
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

// @@TODO - following should prob be class methods
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

  return components
}

// do any pre-fetch processing of component definits here
const prefetchProcessDashComponents = (_components, params) => {
  const components = _components.map(component => {
    let componentInput = {
      type: component.type,
      resourceHandle: component.resourceHandle,
      componentKey: component.key,
      dataFields: component.dataFields
    }

    // add valid filter values if present
    if (params.limit || component.limit) {
      componentInput.limit = params.limit || component.limit
    }
    
    if (params.where || component.where) {
      componentInput.where = params.where || component.where
    }

    // @@TODO add where order limit (add'l filters) based on params
    return componentInput
  })

  return components
}

// generate qraphql query vars from app config and
// user supplied filter values
const graphqlQueryVars = () => { 
  const params = getParams()
  const filters = getDashFilters()
  const _components = getDashComponents()
  const components = prefetchProcessDashComponents(_components, params)
  
  const variables = {
    components: components
  }

  const limit = (params && params.start_date) ? parseInt(params.start_date[0]) : 4 // configure default filter values

  return variables
}

const getParams = () => {
  const params = (history.location.search) ? queryString.parse(history.location.search, {arrayFormat: 'bracket'}) : {}
  return params
}

export default graphql(query, { options : { variables : graphqlQueryVars() }})(App)
