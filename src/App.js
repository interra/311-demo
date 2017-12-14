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
    const additionalQs = ['getServiceNumbersByNeighborhood']
    const props = Object.assign(config, this.props, {params: getParams(), history: history, additionalQs: additionalQs})
    
    return (
      <div id="app-container">
        <h1>{props.title}</h1>
        <Dashboard {...props} />
      </div>
    )
  }
}

const query = gql`
  query getComponents ($components: [ComponentInput]!, $serviceName: String!, $mapQueryKey: String!) {
  getServiceNumbersByNeighborhood (serviceName: $serviceName, componentKey: $mapQueryKey){
    data {JSONResponse}
    componentKey
  }

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
	const components = config.regions.reduce((acc, region) => {
		return acc.concat(region.children)
	}, [])

  return components
}

const getComponentsQ = () => {
	const components = config.regions.reduce((acc, region) => {
		return acc.concat(region.children.filter(item => item.resourceHandle))
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

// based on applied filters, return map field filter val
// for 
// @@TODO this should / could be generalized based on config
const getFilterValue = (filters, field) => {
  const vals = filters.filter(f => f.attribute === field)
  // @@TODO this will vary with multi filters:
  return (vals.length > 0) ? vals[0].value : ""
}

// generate qraphql query vars from app config and
// user supplied filter values
const graphqlQueryVars = () => { 
  const params = getParams()
  const filters = getDashFilters()
  const filterVals = getWhere(filters, params)
  const components = getDashComponents()
  const _componentsQ = getComponentsQ()
  const componentsQ = prefetchProcessDashComponents(_componentsQ, filterVals)
  const serviceName = getFilterValue(filterVals, "service_name")

  const variables = {
    components: componentsQ,
    serviceName: serviceName,
    mapQueryKey: "neighborhoodMap"
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
