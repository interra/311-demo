import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import {GeoJSON} from 'react-leaflet'
import { Map, Circle, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import FontAwesome from 'react-fontawesome'
const SELECTED_FILL_COLOR = "red"
const SELECTED_FILL_OPACITY = .65
const UNSELECTED_FILL_COLOR = "purple"
const UNSELECTED_FILL_OPACITY = .65
const TILE_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
const TILE_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const MAP_CENTER = [39.9728, -75.1638]
const ZOOM_LEVEL = 10.7
const mapOpts = { 
  center: MAP_CENTER,
  zoomControl: false,
  zoom: ZOOM_LEVEL, 
  maxZoom: 19, 
  minZoom: 6, 
  scrollWheelZoom: false,
  legends: true,
  infoControl: false,
  attributionControl: true
}

export default class NeighborhoodFilter extends BaseFilter {
  componentWillMount() {
    this.setState({selected: this.props.params[this.props.filterKey] || [], showFilter: true})
  }
  
  unzoom() {
    this.setState({zoom: ZOOM_LEVEL, mapCenter: MAP_CENTER})
    this.render()
  }

  onEachFeature(feature, layer) {
    const vals = this.state.selected
    
    if (vals.indexOf(feature.properties.name) >= 0) {
      feature.properties.selected = true
    } else {
      feature.properties.selected = false
    }
    
    this.layer = layer
    layer.on({
      click: this.handleOnChange.bind(this)
    })
  }

  handleOnChange(e) {
    let vals = this.state.selected
    const clicked = e.target.feature.properties.name
    const deselect = e.target.feature.properties.selected
    
    if (deselect) {
      const index = vals.indexOf(clicked)
      vals = vals.filter(val => val !== clicked)
    } else {
      vals.push(clicked)
    }
    
    this.setState({selected: vals})
    
    this.doOnChange(vals.map(item => {
      return {value: item}
    }))

  }

  toggleFilter(e) {
    console.log('hidefilter',e)
    this.setState({showFilter: !this.state.showFilter})
  }

  updateStyle(feature) {
    if (feature.properties.selected === true) {
      return {
        fillColor: SELECTED_FILL_COLOR,
        fillOpacity: SELECTED_FILL_OPACITY
      }
    } else {
      return {
        fillColor: UNSELECTED_FILL_COLOR,
        fillOpacity: UNSELECTED_FILL_OPACITY
      }
    }
  } 

  getFilterLayer() {
    console.log('GET FI', this.state.showFilter)
    if (this.state.showFilter) {
      const geoid = this.state.selected.join('_')
      return ( 
        <GeoJSON
          data={phillyHoodsGeoJson}
          key={geoid}
          className="neighborhoods_path"
          onEachFeature={this.onEachFeature.bind(this)}
          style={this.updateStyle}
        />
      )
    }
  }
	
  render(){
    const _mapOpts = Object.assign(mapOpts, {zoom: this.state.zoomLevel || ZOOM_LEVEL, center: this.state.center || MAP_CENTER})
    
    return (
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom.bind(this)}/>
      <form onSubmit={this.hideFilter}>
        <label>
          Hide Filter:
          <input type="checkbox" value={this.state.showFilter} onChange={this.toggleFilter.bind(this)} />
        </label>
      </form>
      <Map {..._mapOpts}>
        <TileLayer
          attribution={TILE_ATTR}
          url={TILE_URL}
        />
        {this.getFilterLayer()}
        <ZoomControl />
      </Map>
    </div>
    )
  }
}
