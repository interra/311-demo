import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import { Map, Circle, Marker, Popup, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import Choropleth from 'react-leaflet-choropleth'
import FontAwesome from 'react-fontawesome'
import Chroma from 'chroma-js'

// convert to props
const SELECTED_FILL_COLOR = "red"
const SELECTED_FILL_OPACITY = .65
const UNSELECTED_FILL_COLOR = "transparent"
const UNSELECTED_FILL_OPACITY = 0
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

// CHOROPLETH SETTINGS
const choroplethStyle = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

const choroplethScale = ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"]
// end props

export default class NeighborhoodFilter extends BaseFilter {
  componentWillMount() {
    this.setState({selected: this.props.params[this.props.filterKey] || [], showFilter: true})
  }

  componentWillUpdate() {
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

  updateStyle(feature) {
    if (feature.properties.selected === true) {
      return {
        fillColor: SELECTED_FILL_COLOR,
        fillOpacity: SELECTED_FILL_OPACITY,
        stroke: false
      }
    } else {
      return {
        fillColor: UNSELECTED_FILL_COLOR,
        fillOpacity: UNSELECTED_FILL_OPACITY,
        stroke: false
      }
    }
  } 

  getNeighborhoodData(feature) {
    const count = this.props.data.filter(n => n.neighborhood === feature.properties.name)
    return (count.length > 0) ? count[0].count: undefined
  }

  getChoropleth() {
    return (	
       <Choropleth
        data={{type: 'FeatureCollection', features: phillyHoodsGeoJson.features }}
        valueProperty={this.getNeighborhoodData.bind(this)}
        scale={choroplethScale}
        steps={5}
        mode='e'
        style={choroplethStyle}
        onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.label)}
      />
    )
  }

  getFilterLayer() {
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

  getChoroplethLegend() {
    const colorScale = choroplethScale.map((color,i) => {
    const datas = this.props.data.map(d => {console.log(d); return d.count})
    const limits = Chroma.limits(datas, 'e',  this.props.steps).map(Math.round)
    const valLower = (limits) ? limits[i] : '--'
    const valUpper = (limits) ? limits[i+1] - 1 : ''

      return (
        <span class="legend-row" style={{display: "inline-block", width:"100%"}}>
          <span style={{float: "left", display: "inline-block", width: "1.2em", height: "1.2em", backgroundColor: color}}></span>
          <span style={{float: "left", marginLeft: "1em"}}>{valLower + ' -- ' + valUpper}</span>
        </span>
      )
    })
    
    return (
      <div class="choropleth-legend">
        {this.props.legendCaption}
        {colorScale}
      </div>
    )
  }

  render(){
    const _mapOpts = Object.assign(mapOpts, {zoom: this.state.zoomLevel || ZOOM_LEVEL, center: this.state.center || MAP_CENTER})
    
    return (
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom.bind(this)}/>
      <Map {..._mapOpts}>
        <TileLayer
          attribution={TILE_ATTR}
          url={TILE_URL}
        />
				{this.getChoropleth()}
        {this.getFilterLayer()}
        <ZoomControl />
      </Map>
      {this.getChoroplethLegend()}
    </div>
    )
  }
}
