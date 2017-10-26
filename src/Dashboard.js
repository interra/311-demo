import React, { Component } from 'react';
import Components from './components/Components.js'

export default class Dashboard extends Component {
  static propTypes = {
	}
  
	getTitle(title) {
    if (title) {
      return ( 
        <h1 className="dashboard-title">{title}</h1>
      )
    } else {
      return
    }
  }

  getRegion(region) {
    return (
      <div id={region.id} className={region.className} key={region.id} >
        {
          region.children.map(component => { 
          
            if (Components.hasOwnProperty(component.type)) {
              let Component = Components[component.type];
              return <Component {...component} />
            } else {	
              console.warn("No component of type "+component.type)
            } 
          })
        }
      </div>
    )
  }
  
  getRegions(regions) {
    return this.props.regions.map(region => this.getRegion(region))
  }

  render() {
    return (
      <div className="dashboard-container">           
        {this.getTitle(this.props.title)}
        {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
