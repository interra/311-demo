import React, { Component } from 'react'
import Dashboard from './components/Dashboard.js'
import NeighborhoodFilter from './components/NeighborhoodFilter.js'
import config from './config.json'
import createHistory from 'history/createBrowserHistory'
import queryString from 'query-string'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import FontAwesome from 'react-fontawesome'
import { Map, Circle, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import phillyHoodsGeoJson from './lib/Neighborhoods_Philadelphia.json'

console.log("PHLH", phillyHoodsGeoJson)
const history = createHistory()

const tileURL = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
const tileAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const mapCenter = [39.9528, -75.1638]
const zoomLevel = 12

const mapOpts = { 
  center: [39.9526, -75.1652],
  zoomControl: false,
  zoom: 13, 
  maxZoom: 19, 
  minZoom: 11, 
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
}

class App extends Component {
  unzoom(e) {
    console.log('UNZOOM_', e)
  }

  getMap() {
	const map = 
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom}/>
      <Map {...mapOpts} >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <NeighborhoodFilter data={phillyHoodsGeoJson} selected={['EAST_PASSYUNK', 'GIRARD_ESTATES']} />
        <ZoomControl />
      </Map>
    </div>

    return map
  }

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
      this.getMap()
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
  const components = prefetchProcessDashComponents(_components, params)
  console.log('CC', components)
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
