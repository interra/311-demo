import React, { Component } from 'react'
import Chroma from 'chroma-js'

export default class ChoroplethLegend extends Component {
  getColorScale() {
    const {data, mode, steps, choroplethColorScale} = this.props
    const limits = Chroma.limits(data, mode, steps).map(Math.round)
    console.log(limits.length, choroplethColorScale.length) 
    // cheap validation
    if (limits.length - 1 !== choroplethColorScale.length) {
      return "---"
    }
    
    return choroplethColorScale.map((color, i) => {
      const valLower = (limits) ? limits[i] : '--'
      const valUpper = (limits) ? limits[i+1] - 1 : ''

      return (
        <span class="legend-row" style={{display: "inline-block", width:"100%"}}>
          <span style={{float: "left", display: "inline-block", width: "1.2em", height: "1.2em", backgroundColor: color}}></span>
          <span style={{float: "left", marginLeft: "1em"}}>{valLower + ' -- ' + valUpper}</span>
        </span>
      )
    })
  }
  
  render() {
    return (
      <div className="choropleth-legend">
        <div className="choropleth-legend-caption">
          {this.props.legendCaption}
        </div>
        <div className="choropleth-legend-scale">
          {this.getColorScale()}
        </div>
      </div>
    )
  }
}
