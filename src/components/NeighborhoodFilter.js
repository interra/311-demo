import React from 'react'
import BaseFilter from './BaseFilter'
import { Map, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet'
import phillyHoodsGeoJson from '../lib/Neighborhoods_Philadelphia.json'
import Choropleth from 'react-leaflet-choropleth'
import FontAwesome from 'react-fontawesome'
import HoverInfo from './HoverInfo.js'
import ChoroplethLegend from './ChoroplethLegend.js'

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
    const count = this.props.data.filter(n => n.neighborhood === feature.properties.name)
    return (count.length > 0) ? count[0].count: undefined
  }
  
  // get whole data series as array of integers for legend scale
  getLegendData() {
    return this.props.data.map(rec => rec.count)
  }

  render() {
    const geoid = this.state.selected.join('_')
    const legendData = this.getLegendData()
    const { infoWindowPos, infoWindowActive, activeSubunitName, activeSubunitValue} = this.state
    const { leafletSettings, choroplethSettings } = this.props
    const { tileUrl, tileAttr } = leafletSettings
    const { choroplethStyle, choroplethColorScale, steps, mode, legendCaption } = choroplethSettings
    
    return (
    <div id="map-container">
      <FontAwesome name="crosshairs" size="2x" onClick={this.unzoom.bind(this)}/>
      <Map {...leafletSettings}>
        <TileLayer
          attribution={tileAttr}
          url={tileUrl}
        />
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
      <ZoomControl />
      <HoverInfo
        active={infoWindowActive}
        position={infoWindowPos}
        name={activeSubunitName}
        value={activeSubunitValue}
      />
      </Map>
      <ChoroplethLegend 
        data = {legendData}
        showLegend = {legendData.length}
        mode = {mode}
        steps = {steps}
        choroplethColorScale = {choroplethColorScale}
        legendCaption = {legendCaption}
      />
    </div>
    )
  }
}
