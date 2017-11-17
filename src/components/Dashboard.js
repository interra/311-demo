import React, { Component } from 'react';
import Components from './Components.js'
import Card from './Card.js'

export default class Dashboard extends Component {
  componentWillMount() {
    console.log('dash will mount __')
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
  
  getNVD3ChartData(data) {
    const series1 = {
      key: 'Key1',
      color: 'blue',
      values: data.slice(0,5)
    }
    
    const series2 = {
      key: 'Key2',
      color: 'red',
      values: data.slice(5, 10)
    }

    return [series1, series2]
  }
  
  getPieChartData(data) {
    return data
  }
  
  // given a dashboard component definition, return appropriate data from API response
  getComponentData(component) {
    console.log('component', component)
    if (this.props.data.getComponents && this.props.data.getComponents) {
      const cDatas = this.props.data.getComponents.filter(item => {
        console.log('item', item)
        if (item.componentKey) {
          return item.componentKey === component.key
        }
        return false
      })
      console.log('cDatas', cDatas)
      if (cDatas.length > 0) {
        const cData = JSON.parse(cDatas[0].data.JSONResponse)
        console.log("cdata", cData, component.type)
        switch (component.dataType) {
          case 'NVD3PieChartSeries':
            const pieData = this.getPieChartData(cData)
            console.log('the data', pieData)
            return pieData
          case 'NVD3ChartSeries':
            return this.getNVD3ChartData(cData)
          default:
            return cData
        }
      } else {
        return []
      }
    }
    return []
  }
  
  getRegion(region, i) {
    return (
      <div id={region.id} className={region.className} key={region.id} >
        {
          region.children.map((component,j) => {
            if (Components.hasOwnProperty(component.type)) {
              console.log('CC', component)
              console.log('test', )
              const Component = Components[component.type]
              const componentData = this.getComponentData(component)
              const componentProps = Object.assign(component, {data: componentData})
              console.log('hasCompData', componentData)
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
    console.log("DASH", this)
    return (
      <div className="dashboard-container">
          {this.getTitle(this.props.title)}
          {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
