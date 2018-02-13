import React, { Component } from 'react'
import Components from './Components.js'
import Card from './Card.js'
import { sortBy } from 'underscore'

export default class Dashboard extends Component {
  componentWillMount() {
    this.history = this.props.history
  }
  
  getRegionTitle(region) {
    if (region.title) { 
      return <h2 className="region-title">{region.title} </h2>
    } else {
      return ""
    }
  }
  
  regionShouldRender(region, params) {
    const qs = Object.keys(params) || []
    if (region.needsParam) {
      return qs.includes(region.needsParam)
    }

    if (region.needsNoParam) {
      return !qs.includes(region.needsNoParam)
    }

    return true;
  }
  
  getRegion(region, i) {
    
    // do conditional rendering based on present filters
    if (this.regionShouldRender(region, this.props.params)) {
    return (
      <div id={region.id} className={`dash-region ${region.className || ''}`} key={region.id} >
        {this.getRegionTitle(region)}
        {
          region.children.map((component,j) => {
            if (Components.hasOwnProperty(component.type)) {
              const Component = Components[component.type]
              const componentProps = Object.assign(component, {params: this.props.params})
              const cardProps = component.cardProps || {}
              const toCard = Object.assign(cardProps, {children: [<Component {...componentProps} key={component.componentKey || 'filter_' + i + '_' + j} history={region.history} />]})
              // wrap component in Card component and return
              return <Card {...toCard} key={i + '__' + j} params={this.props.params} />
            } else {	
              return <p>"BAD COMPONENT DEFINITION"</p>
            } 
          })
        }
      </div>
    )
    }
  }
  
  getRegions(regions) {
    if (regions) {
      return regions.map(region => {
        // just attach history object
        const _region = Object.assign({history: this.props.history}, region)
        return this.getRegion(_region)
      })
    }
    return <p>Loading</p>
  }

  render() {
    return (
      <div className="dashboard-container">
          {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
