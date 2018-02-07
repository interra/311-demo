import React from 'react'
import BaseFilter from './BaseFilter'
import { Map, TileLayer, Marker, Popup, ZoomControl, GeoJSON } from 'react-leaflet'
import Leaflet from 'leaflet'
import Control from 'react-leaflet-control'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import Choropleth from 'react-leaflet-choropleth'
import FontAwesome from 'react-fontawesome'
import HoverInfo from './HoverInfo.js'
import ChoroplethLegend from './ChoroplethLegend.js'
import mapMarkerUrl from '../images/map-marker-icon.png'
import blueMapMarkerUrl from '../images/map-marker-icon-blue.png'
import choroplethIcon from '../images/choropleth_icon.png'
import neighbIcon from '../images/choropleth_icon_empty.png'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import '../../node_modules/react-leaflet-markercluster/dist/styles.min.css'

const mapMarker = new Leaflet.Icon({
  iconUrl: mapMarkerUrl,
  iconSize: [50,50]
})

const blueMapMarker = new Leaflet.Icon({
  iconUrl: blueMapMarkerUrl,
  iconSize: [60,50]
})

export default class NeighborhoodFilter extends BaseFilter {
  constructor(props) {
    super(props)
    this.state = {
      neighborhoodEnabled: true,
      choroplethEnabled: true
    }
  }
  
  componentWillMount() {
    const geojsonUrl = this.props.geojsonUrl
    this.resetInfoWindow()
    this.fetchGeojson(geojsonUrl).then(res => {
      this.setState({geojson: res})
    })
  }
  
  /**
   * Fetch geojson by url
   **/
  fetchGeojson(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then(function(response) {
        return response.json();
      }).then(function(geojson) {
        resolve(geojson)
      }); 
    })
  }

  resetInfoWindow() {
    const newState = {
      infoWindowPos: {x: 0, y: 0},
      infoWindowActive: false,
      activeSubunitName: 'default',
      selected: this.props.params[this.props.filterKey] || []
    }

    this.setState(newState)
  }

  unzoom() {
    const {zoom, center} = this.props.leafletSettings
    this.setState({zoom: zoom, mapCenter: center})
    this.render()
  }
  
  onEachFeature(feature, layer) {
    layer.on({
      click: this.setActiveRegion.bind(this),
    })
    
    if (this.state.selected.includes(feature.properties.name)) {
      feature.properties.selected = true
    } else {
      feature.properties.selected = false
    }

    return feature
  }
  
  // note - not really implemented
  // this could allow users to select a geojson region
  // and then update state accordingly
  // so we could provide drill-down behavior for ex
  // @@TODO this should be in user space
  setActiveRegion(e) {
    const feature = (e.layer) ? e.layer.feature : e.target.feature
    const key = this.props.featureIdentifier
    let newState

    if (feature) {
      console.log("FF", feature)
      if (this.state.activeSubunitName === feature.properties[key]) {
        // feature is already selected
        newState = {
          infoWindowActive: false,
          activeSubunitName: null,
          activeSubunitValue: null,
          selected: []
        }
      } else {
        newState = {
          infoWindowActive: true,
          infoWindowPos: {x: e.originalEvent.clientX, y: e.originalEvent.clientY},
          activeSubunitName: feature.properties[key],
          activeSubunitValue: this.getNeighborhoodVal(feature) || 'No requests',
          selected: [feature.properties[key]]
        }  
      }
      this.setState(newState)  
      this.render()}
  }

  // not really implemented I think
  // update geojson style based on whether it is selected (state)
  updateStyle(feature) {
    const neighborhoodEnabledStyle = {"stroke": "black", "stroke-width": 2, "stroke-dasharray": "20,10,5,5,5,10", fillColor: "transparent", fillOpacity: "0" }
    const {selectedFillColor, selectedFillOpacity, unselectedFillColor, unselectedFillOpacity} = this.props.leafletSettings
    return neighborhoodEnabledStyle
    const styles = (feature.properties.selected) 
    ? 
      { fillColor: selectedFillColor,
        fillOpacity: selectedFillOpacity,
        stroke: false
      } 
    : 
      {
        fillColor: unselectedFillColor,
        fillOpacity: unselectedFillOpacity,
        stroke: false
      }
    
    if (this.state.neighborhoodEnabled) {
      return neighborhoodEnabledStyle
    } else {
      return styles
    }
  } 

  // get a single value from data per feature for choropleth
  // @@UGH userify all this
  getNeighborhoodVal(feature) {
    const queryKey = this.props.queryKey
    const data = this.props.addlData[queryKey] || []
    const featureKey = this.props.choroplethSettings.featureKey
    const dataKey = this.props.choroplethSettings.dataKey
    const count = data.filter(n => n[dataKey] === feature.properties[featureKey])

    return (count.length > 0) ? parseFloat(count[0].count) : undefined // @@TODO ugh this needs to correspond with the API return
  }
  
  getActiveFeature() {
    const featureKey = this.props.choroplethSettings.featureKey
    const features = (this.state.geojson) ? this.state.geojson.features : null
    const feature = (features) ? features.filter(f => f.properties[featureKey] == this.state.activeSubunitName)[0] : null
  
    return feature
  }
  
  // get data fields for active data subunit
  getNeighborhoodData() {
    const queryKey = this.props.queryKey
    const data = this.props.addlData[queryKey] || []
    const dataKey = this.props.choroplethSettings.dataKey
    const selected = data.filter(n => n[dataKey] === this.state.activeSubunitName)
    const activeFeature = this.getActiveFeature()
    console.log("NN", selected, activeFeature)

    // @@TODO I would like this to be in config 
    // @@TODO not code
    // @@TODO or in user space somehow
    if (selected.length > 0) {
      return [
        {key: "Police District", val: selected[0].dist_occurrence},
        {key: "Total Complaints", val: selected[0].count},
        {key: "Address", val: activeFeature.properties.LOCATION},
        {key: "Phone", val: activeFeature.properties.PHONE}
      ]
    }

    return []
  }
  
  // get whole data series as array of integers for legend scale
  getLegendData() {
    const queryKey = this.props.queryKey
    const data = this.props.addlData[queryKey] || []
    
    // @@TODO this shuold be a configured variable (eg rate / count) see getNeighborhoodData above:
    return data.map(rec => parseFloat(rec.count))
  }
  
  /**
   * Sadly we need to hide the legend when the popup is selected
   * because of the ways of leaflet 
   * https://stackoverflow.com/questions/42227664/leaflet-map-with-popup-above-legend/42234061
   */
  togglePopupOnClick(e) {
    let popupOpen

    if (!this.state.popupPos || JSON.stringify(e.latlng) !== this.state.popupPos) {
      popupOpen = true
    } else {
      popupOpen = false
    }
    
    this.setState({
      popupOpen: popupOpen,
      popupPos: JSON.stringify(e.latlng)
    })
  }

  getMarker(row, i) {
    const image = (row.media_url) ? <img src={row.media_url} alt="image accompanying 311 request" width="100%" /> : ""
    const marker = (image) ? blueMapMarker : mapMarker
    
    return (
      <Marker position={[row.lat, row.lon]} icon={marker} key={"marker_" + i} onClick={this.togglePopupOnClick.bind(this)}>
        <Popup key={"POPup"+i}>
          <div class="popup-container">
          <ul className="outstanding-popup">
            <li>
              <p className="left">Address</p>
              <p className="right">{row.address}</p>
            </li>
            <li>
              <p className="left">Expected resolution</p>
              <p className="right">{row.expected_datetime}</p>
            </li>
            <li>
              <p className="left">Agency</p>
              <p className="right">{row.agency_responsible}</p>
            </li>
          </ul>
          {image}
          </div>
        </Popup>
      </Marker>
    )
  }

  getMarkers() {
    const rows = this.props.addlData.getOutstandingRequests || []
    const markers = rows.filter(row => (row.lat && row.lon)).map(this.getMarker.bind(this))

    return <MarkerClusterGroup options={{spiderifyOnMaxZoom: false, chunkedLoading: true}}>
            {markers}
           </MarkerClusterGroup>
  }

  getNeighborhoodBoundaries() {
    const geoid = this.state.selected.join('_')
    const {infoWindowPos, infoWindowActive,activeSubunitName, activeSubunitValue } = this.state
    const rows = this.getNeighborhoodData()
    const neighbStyle = {color: "black", weight: 1, opacity:.6, fillColor: "transparent", fillOpacity: "0" }
    const geojson = this.state.geojson

    if (!geojson) return

    return (
    <div className="neighborhood-layer">
      <GeoJSON
          data={geojson}
          key={geoid}
          className="neighborhoods_path"
          onEachFeature={this.onEachFeature.bind(this)}
          style={neighbStyle}
        />
        <HoverInfo
          active={infoWindowActive}
          position={infoWindowPos}
          rows={rows}
        />
    </div>
    )
  }

  getChoropleth() {
    const { choroplethStyle, choroplethColorScale, steps, mode, legendCaption } = this.props.choroplethSettings
    const features = (this.state.geojson) ? this.state.geojson.features : []
    if (this.state.choroplethEnabled) {
      return (
        <div id="choropleth-container">
          <Choropleth
              data={{type: 'FeatureCollection', features: features }}
              valueProperty={this.getNeighborhoodVal.bind(this)}
              scale={choroplethColorScale}
              steps={steps}
              mode={mode}
              style={choroplethStyle}
          />
          { this.getNeighborhoodBoundaries() }
        </div>
      )
    } else if (this.state.neighborhoodEnabled) {
      return (
        <div class="geojson-no-choropleth">
          { this.getNeighborhoodBoundaries() }
        </div>
      ) 
    }
  }
  
  getChoroplethLegend() {
    const legendData = this.getLegendData()
    const legendOpen = (this.state.popupOpen) ? false : legendData.length
    const { choroplethColorScale, steps, mode, legendCaption } = this.props.choroplethSettings
    if (this.state.choroplethEnabled) {
      return ( 
        <ChoroplethLegend 
          data = {legendData}
          showLegend = {legendOpen}
          mode = {mode}
          steps = {steps}
          choroplethColorScale = {choroplethColorScale}
          legendCaption = {legendCaption}
        />
      )
    }
  }

  toggleParam(param) {
    let newState = {}
    newState[param] = !this.state[param]
    this.setState(Object.assign(this.state, newState))
  }
  
  getToolbar() {
    const choroplethEnabledClass = (this.state.choroplethEnabled) ? 'toolbar-icon-enabled' : ''
    const neighBoundEnabledClass = (this.state.neighborhoodEnabled) ? 'toolbar-icon-enabled' : ''
    return (
      <div className="toolbar row" style = {{ height: '60px' }}>
        <div className={`col-sm-1 doHover toolbar-icon ${choroplethEnabledClass}`} title="Toggle choropleth" id="toolbar-choropleth" style={ {height: 'inherit', backgroundImage: `url(${choroplethIcon})`, backgroundSize:  '40px', backgroundRepeat: 'no-repeat'} } onClick={this.toggleParam.bind(this, 'choroplethEnabled')}/>
        <div className={`col-sm-1 doHover toolbar-icon ${neighBoundEnabledClass}`} title="Toggle neighborhood boundaries" id="toolbar-neighborhood" style={ {height: 'inherit', backgroundImage: `url(${neighbIcon})`, backgroundSize:  '40px', backgroundRepeat: 'no-repeat'} } onClick={this.toggleParam.bind(this, 'neighborhoodEnabled')}/>
      </div>
    )
  }
  
  render() {
    // get overrides from state
    let leafletOverrides = {}
    const  leafletSettings = Object.assign(this.props.leafletSettings, leafletOverrides)
    const { tileUrl, tileAttr } = leafletSettings
    
    return (
    <div id="map-container">
      <Map ref="map" {...leafletSettings}>
        <TileLayer
          attribution={tileAttr}
          url={tileUrl}
        />
        {this.getChoropleth()}
      </Map>
      {this.getChoroplethLegend()}
    </div>
    )
  }
}
