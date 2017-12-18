import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FontAwesome from 'react-fontawesome'
import interraLogoWhite from './images/interra-logo-white.png'
import InfoModal from './InfoModal.js'

const history = createHistory()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {infoWindowOpen : false}
  }	
  
  componentDidMount() {
    // subscribe to query update
    history.listen((location, action) => {
      this.forceUpdate()
      this.props.data.refetch(graphqlQueryVars())
    })
  }

  toggleInfoWindow() {
    this.setState({infoWindowOpen : !this.state.infoWindowOpen})
  }


  render() {
    const additionalQs = ['getServiceNumbersByNeighborhood']
    const infoWindowClass = (this.state.infoWindowOpen) ? 'info-window-open' : 'info-window-closed'
    const props = Object.assign(config, this.props, {params: getParams(), history: history, additionalQs: additionalQs})
    
    return (
      <div id="app-container" className={infoWindowClass}>
        <div className="row">
          <div className="col-md-6 311-app-title">
            <h1>
              {props.title}
                <FontAwesome name="info-circle" size="1x" className="title-info doHover" onClick={this.toggleInfoWindow.bind(this)} />
            </h1>
          </div>
          <div className="col-md-6 social-logos">
            <a href="https://github.com/interra/311-demo">
              <FontAwesome name="github" className="doHover" size="2x" target="_blank" />
            </a>
            <a href="http://interra.io" target="_blank">
              <img className="interra-icon-white" src={interraLogoWhite} />
            </a>
          </div>

        </div>
        <Dashboard {...props} display={!this.state.infoWindowOpen}/>
        <InfoModal infoWindowOpen={this.state.infoWindowOpen} toggleInfoWindow={this.toggleInfoWindow.bind(this)} infoWindowClass={infoWindowClass} />
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
  if (filterRegion.length === 1) {
    return filterRegion[0].children
  } else {
    return []
  }
}

const getComponentsQ = () => {
	const components = config.regions.reduce((acc, region) => {
		return acc.concat(region.children.filter(item => item.resourceHandle))
	}, [])
  
  return components
}

// only apply filters that component are subscribed to
const whereFromFilters = (component, filterVals) => {
  const applied = filterVals.filter(f => component.filters && component.filters.includes(f.attribute))
  return applied
}


// do any pre-fetch processing of component definits here
const prefetchProcessDashComponents = (_components,filterVals) => {
  const components = _components.map(component => {
    const applied = whereFromFilters(component, filterVals)
    const where = component.where.concat(applied)
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
