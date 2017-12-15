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
        <span className="legend-row" key={"chp-legend-row" + i}>
          <span className="color-chip" style={{backgroundColor: color}}></span>
          <span className="val-container">{valLower + ' -- ' + valUpper}</span>
        </span>
      )
    })
  }
  
  render() {
    const display = (this.props.showLegend) ? 'block' : 'none'
    return (
      <div className="choropleth-legend" key="chp-legend" style={{display: display}}>
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
