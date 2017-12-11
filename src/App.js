import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

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
const prefetchProcessDashComponents = (_components,filterVals) => {
  const components = _components.map(component => {
    const where = filterVals.concat(component.where)

    const componentInput = {
      type: component.type,
      resourceHandle: component.resourceHandle,
      componentKey: component.componentKey,
      count: component.count,
      limit: component.limit,
      dataFields: component.dataFields,
      where: where
    }

    return componentInput
  })

  return components
}

// generate qraphql query vars from app config and
// user supplied filter values
const graphqlQueryVars = () => { 
  const params = getParams()
  const filters = getDashFilters()
  const filterVals = getWhere(filters, params)
  const _components = getDashComponents()
  const components = prefetchProcessDashComponents(_components, filterVals)
  
  const variables = {
    components: components
  }


  return variables
}

const getParams = () => {
  const params = (history.location.search) ? queryString.parse(history.location.search, {arrayFormat: 'bracket'}) : {}
  return params
}

// Apply filter values to query
const getWhere = (filters, params) => {
  const fVals = Object.keys(params).map(key => {
    // const filter = filters.filter(f => f.filterKey === key)[0]
    // @@TODO later we could use this filter def to add operation $gte $lt etc
    return {attribute: key, value: params[key]}
  })
  
  return fVals
}

export default graphql(query, { options : { variables : graphqlQueryVars() }})(App)
