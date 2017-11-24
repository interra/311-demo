import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import {GeoJSON} from 'react-leaflet'

const SELECTED_FILL_COLOR = "red"
const SELECTED_FILL_OPACITY = .65

export default class NeighborhoodFilter extends BaseFilter {
  onEachFeature(feature, layer) {
    // @@TODO - needs to be declared as filter in config
    // @@TODO - grab filter props from config
    // @@TODO - serialize filter values to/from url
    // @@TODO - need to write the graphql queries for this
    const vals = this.getFilterValue()
    console.log('VALS', vals)
    if (vals && vals.indexOf(feature.properties.name) >= 0) {
      feature.properties.selected = true
    } 
    
    layer.on({
      click: this.handleOnChange.bind(this)
    })
  }

  handleOnChange(e) {
    let vals = this.props.selected || []
    const clicked = e.target.feature.properties.name
    const deselect = e.target.feature.properties.selected
    console.log("onchange-__-", e, vals, clicked, deselect)
    
    if (deselect) {
      const index = vals.indexOf(clicked)
      vals = vals.filter(val => val !== clicked)
    } else {
      vals.push(clicked)
    }
    
    this.doOnChange(vals.map(item => {
      return {value: item}
    }))
  }

  updateStyle(feature) {
    if (feature.properties.selected) {
      console.log("SELECTEDS STYEL")
      return {
        fillColor: SELECTED_FILL_COLOR,
        fillOpacity: SELECTED_FILL_OPACITY
      }
    }
  }
	
  render(){
    return (
        <GeoJSON 
          data={this.props.data}
          className="neighborhoods_path"
          onEachFeature={this.onEachFeature.bind(this)}
          style={this.updateStyle}
        />
    )
  }
}
