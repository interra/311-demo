import React, { Component } from 'react'
import Chroma from 'chroma-js'

export default class ChoroplethLegend extends Component {
  getColorScale() {
    const {data, mode, steps, choroplethColorScale} = this.props
    const limits = Chroma.limits(data, mode, steps).map(Math.round)
    
    // cheap validation
    if (limits.length - 1 !== choroplethColorScale.length) {
      return "---"
    }
    
    return choroplethColorScale.map((color, i) => {
      const valLower = (limits) ? limits[i] : '--'
      const valUpper = (limits) ? limits[i+1] - 1 : ''

      return (
        <span className="legend-row" style={{display: "inline-block", width:"100%"}} key={"chp-legend-row" + i}>
          <span style={{float: "left", display: "inline-block", width: "1.2em", height: "1.2em", backgroundColor: color}}></span>
          <span style={{float: "left", marginLeft: "1em"}}>{valLower + ' -- ' + valUpper}</span>
        </span>
      )
    })
  }
  
  render() {
    return (
      <div className="choropleth-legend" key="chp-legend" >
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
