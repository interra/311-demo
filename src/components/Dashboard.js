import React, { Component } from 'react'
import Components from './Components.js'
import Card from './Card.js'
import { sortBy } from 'underscore'

export default class Dashboard extends Component {
  componentWillMount() {
    this.history = this.props.history
  }

  // @@TODO should return n series
  // @@TODO based on config
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
    const sortKey = Object.keys(data[0])[0]
    return sortBy(data, sortKey)
  }
  
  // given a dashboard component definition, return appropriate data from API response
  // @@TODO want to clean this up to allow for additional arbitrary graphql queries - as defined by parent app, which will add valid component-level data to arbitrary components
  // @@TODO define the data api for the dashboard here - 
  // @@TODO there are two levels of abstraction: 
  //          standardized components
  //          arbitrary app-defined graphql query data
  getComponentData(component) {
    if (this.props.data.getComponents) {
    const componentData = this.props.data.getComponents
    // append data from addl queries, used for the map layer component
    const addlData = this.props.additionalQs.reduce((acc, addl) => {
      return acc.concat(this.props.data[addl])
    }, [])

    const allData = componentData.concat(addlData)
      const cDatas = allData.filter(item => {
        if (item.componentKey) {
          return item.componentKey === component.componentKey
        }

        return false
      })

      if (cDatas.length > 0) {
        const cData = JSON.parse(cDatas[0].data.JSONResponse)
        
        switch (component.dataType) {
          case 'NVD3PieChartSeries':
            const pieData = this.getPieChartData(cData)
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
  
  getRegionTitle(region) {
    if (region.title) { 
      return <h2>{region.title} </h2>
    } else {
      return ""
    }
  }
  
  getRegion(region, i) {
    return (
      <div id={region.id} className={`dash-region ${region.className || ''}`} key={region.id} >
        {this.getRegionTitle(region)}
        {
          region.children.map((component,j) => {
            if (Components.hasOwnProperty(component.type)) {
              const Component = Components[component.type]
              const componentData = this.getComponentData(component)
              const componentProps = Object.assign(component, {data: componentData, params: this.props.params})
              const cardProps = component.cardProps || {}
              const toCard = Object.assign(cardProps, {children: [<Component {...componentProps} key={component.componentKey || 'filter_' + i + '_' + j} history={region.history} />]})
              // wrap component in Card component and return
              return <Card {...toCard} key={i + '__' + j}/>
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
          {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
