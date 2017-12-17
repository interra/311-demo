import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FontAwesome from 'react-fontawesome'
import interraLogoWhite from './images/interra-logo-white.png'
import Modal from 'react-modal'

const history = createHistory()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {info : false}
  }	
  
  componentDidMount() {
    // subscribe to query update
    history.listen((location, action) => {
      this.forceUpdate()
      this.props.data.refetch(graphqlQueryVars())
    })
  }

  toggleInfoWindow() {
    this.setState({info : !this.state.info})
  }


  render() {
    const additionalQs = ['getServiceNumbersByNeighborhood']
    const infoWindow = this.state.info
    const infoWindowClass = (this.state.info) ? 'info-window-open' : 'info-window-closed'
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
        <Dashboard {...props} display={!infoWindow}/>
				<Modal isOpen={infoWindow}>
        <div className="info-window-content">
					<h1>Welcome to the 311 Dash Demo</h1>
				  <p class="close-modal doHover" onClick={this.toggleInfoWindow.bind(this)}>X</p>
          <div class="info-window-content-inner">
					<p>Welcome to the Philly 311 dashboard demo! Click around and feel free to leave feedback at our website: `https://interra.io`!</p>
          <p>We are using sample data from the Philly 311 API, which leverages the Open311 standard (link). This means that we can easily implement this dashboard for ANY city or municipality that leverages this standard.</p>
          <p>If you are interested in Open311, or open data generally,  have a look at these references:</p>
          <ul class="info-list">
            <li><a href="http://interria.io">Interra Open Data Catalog</a></li>
            <li><a href="http://wiki.open311.org/" target="_blank">Open 311 WIKI</a></li>
            <li><a href="https://www.opendataphilly.org/" target="_blank">Open Data Philly</a></li>
          </ul>
          <p>If you have questions or comments, or if you are interested in implementing an open data project, <a href="mailto:info@interra.io" target="_top">Contact Us</a>.</p>
          </div>
        </div>
				</Modal>
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
