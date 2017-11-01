import React, { Component } from 'react';
import Components from './components/Components.js'
import Card from './components/Card.js'

export default class Dashboard extends Component {
  componentWillMount() {
    this.history = this.props.history
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

  getRegion(region, i) {
    return (
      <div id={region.id} className={region.className} key={region.id} >
        {
          region.children.map((component,j) => {
            if (Components.hasOwnProperty(component.type)) {
              let Component = Components[component.type]
              const cardProps = component.cardProps || {}
              const toCard = Object.assign(cardProps, {children: [<Component {...component} history={region.history} />], key: i + '__' + j})
              // wrap component in Card component and return
              return <Card {...toCard}/>
            } else {	
              return <p>"BAD COMPONENT DEFINITION"</p>
            } 
          })
        }
      </div>
    )
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
          {this.getTitle(this.props.title)}
          {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
