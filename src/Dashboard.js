import React, { Component } from 'react';
import Components from './components/Components.js'
import Card from './components/Card.js'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

export default class Dashboard extends Component {
  static propTypes = {
	}

  componentWillMount() {
    console.log('dash will mount')
    const unlisten = history.listen((location, action) => {
      console.log('history listen', location, action)
      // if we need to refetch
      this.forceUpdate()
    })
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
            console.log('component', component)
            if (Components.hasOwnProperty(component.type)) {
              let Component = Components[component.type];
              const cardProps = component.cardProps || {}
              const toCard = Object.assign(cardProps, {children: [<Component {...component} history={history} />], key: i + '__' + j})
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
    return this.props.regions.map(this.getRegion)
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
