import React from 'react'
import BaseFilter from './BaseFilter'
import { Map, TileLayer, Marker, Popup, ZoomControl, GeoJSON } from 'react-leaflet'
import Leaflet from 'leaflet'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import Choropleth from 'react-leaflet-choropleth'
import FontAwesome from 'react-fontawesome'
import HoverInfo from './HoverInfo.js'
import ChoroplethLegend from './ChoroplethLegend.js'
import mapMarkerUrl from '../images/map-marker-icon.png'
import blueMapMarkerUrl from '../images/map-marker-icon-blue.png'
import choroplethIcon from '../images/choropleth_icon.png'
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
  componentWillMount() {
    this.resetInfoWindow()
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
  
  // description
  onEachFeature(feature, layer) {
    const vals = this.state.selected
    
    if (vals.indexOf(feature.properties.name) >= 0) {
      feature.properties.selected = true
    } else {
      feature.properties.selected = false
    }
    
    this.layer = layer
    layer.on({
      click: this.handleOnChange.bind(this),
      mouseEnter: this.setActiveRegion.bind(this)
    })
  }

  // description
  handleOnChange(e) {
    let vals = this.state.selected
    const clicked = e.target.feature.properties.name
    const deselect = e.target.feature.properties.selected
    
    if (deselect) {
      vals = vals.filter(val => val !== clicked)
    } else {
      vals = [clicked]
    }
    
    this.setState({selected: vals})
    
    this.doOnChange(vals.map(item => {
      return {value: item}
    }))
  }
  
  setActiveRegion(e) {
    if (e.layer.feature) {
      console.log(e.layer.feature)
      this.setState({
          infoWindowActive: true,
          infoWindowPos: {x: e.originalEvent.clientX, y: e.originalEvent.clientY}, // get from e.offset
          activeSubunitName: e.layer.feature.properties.name,
          activeSubunitValue: this.getNeighborhoodData(e.layer.feature) || 'No requests'
      })  
    }
  }

  resetActiveRegion(e) {
    if (e.layer.feature.properties.name === this.state.activeSubunitName) {
      this.resetInfoWindow()
    }
  }

  updateStyle(feature) {
    const {selectedFillColor, selectedFillOpacity, unselectedFillColor, unselectedFillOpacity} = this.props.leafletSettings
    if (feature.properties.selected === true) {
      return {
        fillColor: selectedFillColor,
        fillOpacity: selectedFillOpacity,
        stroke: false
      }
    } else {
      return {
        fillColor: unselectedFillColor,
        fillOpacity: unselectedFillOpacity,
        stroke: false
      }
    }
  } 

  // get a single value from data per feature for choropleth
  getNeighborhoodData(feature) {
    const data = this.props.addlData.getServiceNumbersByNeighborhood || []
    const count = data.filter(n => n.neighborhood === feature.properties.name)
    return (count.length > 0) ? count[0].count: undefined
  }
  
  // get whole data series as array of integers for legend scale
  getLegendData() {
    const data = this.props.addlData.getServiceNumbersByNeighborhood || []
    return data.map(rec => rec.count)
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
              <p className="left">Registered</p>
              <p className="right">{row.created_at}</p>
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
    console.log('MMM', rows, markers)

    return <MarkerClusterGroup>
            {markers}
           </MarkerClusterGroup>
  }

  getGeoJSON() {
    const geoid = this.state.selected.join('_')
    return (
        <GeoJSON
            data={phillyHoodsGeoJson}
            key={geoid}
            className="neighborhoods_path"
            onEachFeature={this.onEachFeature.bind(this)}
            onMouseOver={this.setActiveRegion.bind(this)}
            onMouseOut={this.resetActiveRegion.bind(this)}
            style={this.updateStyle.bind(this)}
          />
      )
  
  }

  getChoropleth() {
    const geoid = this.state.selected.join('_')
    const { infoWindowPos, infoWindowActive, activeSubunitName, activeSubunitValue} = this.state
    const { choroplethStyle, choroplethColorScale, steps, mode, legendCaption } = this.props.choroplethSettings
    if (this.state.showChoropleth) {
      return (
        <div id="choropleth-container">
          <Choropleth
              data={{type: 'FeatureCollection', features: phillyHoodsGeoJson.features }}
              valueProperty={this.getNeighborhoodData.bind(this)}
              scale={choroplethColorScale}
              steps={steps}
              mode={mode}
              style={choroplethStyle}
              //onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.label)}
          />
          <GeoJSON
            data={phillyHoodsGeoJson}
            key={geoid}
            className="neighborhoods_path"
            onEachFeature={this.onEachFeature.bind(this)}
            onMouseOver={this.setActiveRegion.bind(this)}
            onMouseOut={this.resetActiveRegion.bind(this)}
            style={this.updateStyle.bind(this)}
          />
          <HoverInfo
            active={infoWindowActive}
            position={infoWindowPos}
            name={activeSubunitName}
            value={activeSubunitValue}
          />
        </div>
      )
    } else {
      console.log("SHOW NIEHGBORHO")
      return (
        <div class="geojson-no-choropleth">
          <GeoJSON
            data={phillyHoodsGeoJson}
            key={geoid}
            className="neighborhoods_path"
            onEachFeature={this.onEachFeature.bind(this)}
            onMouseOver={this.setActiveRegion.bind(this)}
            onMouseOut={this.resetActiveRegion.bind(this)}
            style={ {stroke: "white", strokeWidth: "2", "stroke-dasharray": "20,10,5,5,5,10", fillColor: "transparent", fillOpacity: "0" }}
          />
          <HoverInfo
            active={infoWindowActive}
            position={infoWindowPos}
            name={activeSubunitName}
            value={activeSubunitValue}
          />
        </div>
      ) 
    }
  }
  
  getChoroplethLegend() {
    const legendData = this.getLegendData()
    const legendOpen = (this.state.popupOpen) ? false : legendData.length
    const { choroplethColorScale, steps, mode, legendCaption } = this.props.choroplethSettings
    
    if (this.state.showChoropleth) {
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

  toggleChoropleth() {
    this.setState({
      showChoropleth: !this.state.showChoropleth
    })
  }

  getToolbar() {
    const choroplethEnabledClass = (this.state.showChoropleth) ? 'choropleth-enabled' : ''
    return (
      <div class="toolbar row" style = {{ height: '60px' }}>
        <div class={`col-sm-3 doHover ${choroplethEnabledClass}`} title="Toggle choropleth" id="toolbar-choropleth" style={ {height: 'inherit', backgroundImage: `url(${choroplethIcon})`, backgroundSize:  '40px', backgroundRepeat: 'no-repeat'} } onClick={this.toggleChoropleth.bind(this)}/>
        <div class="col-sm-3" id="toolbar-calendar"/>  
      </div>
    )
  }
  
  render() {
    const  leafletSettings = this.props.leafletSettings
    const { tileUrl, tileAttr } = leafletSettings
    
    return (
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom.bind(this)}/>
      {this.getToolbar()}
      <Map {...leafletSettings}>
        <TileLayer
          attribution={tileAttr}
          url={tileUrl}
        />
        <ZoomControl position="topright" />
        {this.getMarkers()}
        {this.getChoropleth()}
      </Map>
      {this.getChoroplethLegend()}
    </div>
    )
  }
}
