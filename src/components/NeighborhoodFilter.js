import React, { Component } from 'react'
import BaseFilter from './BaseFilter'
import {GeoJSON} from 'react-leaflet'

export default class NeighborhoodFilter extends BaseFilter {
  onEachFeature(feature, layer) {
    if (this.props && this.props.selected && this.props.selected.indexOf(feature.properties.name) >= 0) {
      feature.properties.selected = true
    } 
    
    layer.on({
      click: (e) => {
        // this should update our query values 
        // fetch
        // render
        console.log('+++CLICK HOOD', e)
      }
    })
    
  }

  updateStyle(feature) {
    console.log('ff',feature)
    if (feature.properties.selected) {
      console.log("SELECTEDS STYEL")
      return {
        color: "red",
        opacity: .65}

    }
      return {fill: "red"}
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
