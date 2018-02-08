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
    return [{
      key: "A",
      values: data
    }]
  }
  
  getPieChartData(data) {
    const sortKey = Object.keys(data[0])[0]
    return sortBy(data, sortKey)
  }

  getChartJSData(data, settings) {
    console.log(settings)
    const xField = settings.series[0].x // use the same labels for all series
    const labels = data.map(row => row[xField])
    console.log("lavel", labels)
    const datasets = settings.series.map(ser => {
      const _data = data.map(row => row[ser.y])
      return {
        label: ser.label,
        backgroundColor: ser.bg,
        borderColor: ser.border,
        borderWidth: ser.borderWidth,
        hoverBackgroundColor: ser.bgHover,
        hoverBorderColor: ser.borderHover,
        data: _data
      }
    })

    return  {
      labels: labels,
      datasets: datasets
    }
  }

  getChartJSTimeSeriesData(data, settings) {
  
  }

  // given a dashboard nt definition, return appropriate data from API response
  // @@TODO want to clean this up to allow for additional arbitrary graphql queries - as defined by parent app, which will add valid component-level data to arbitrary components
  // @@TODO define the data api for the dashboard here - 
  // @@TODO there are two levels of abstraction: 
  //          standardized components
  //          arbitrary app-defined graphql query data
  getComponentData(component) {
    if (this.props.data.getComponents) {
      const componentData = this.props.data.getComponents
      // append data from addl queries, used for the map layer component
      const cDatas = componentData.filter(item => {
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
          case 'ChartJS':
            return this.getChartJSData(cData, component)
          case 'Scalar':
            return [cData[0].count] // assumes a count value - better to just return a scalar from the api
          default:
            return cData
        }
      } else {
        return []
      }
    }

    return []
  }
  
  /**
   * Allow us to define arbitrary graphQL queries and use their
   * data in custom components
   **/
  getAddlData (qs) {
      return this.props.additionalQs.reduce( (acc, addl) => {
          const _data = this.props.data[addl]
          if (_data && _data.responseType === "JSONResponse") {
            acc[addl] = JSON.parse(_data.data.JSONResponse)
          } else {
            acc[addl] = _data
          }

          return acc
      }, {})
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
    const addlData = this.getAddlData(this.props.addlQs)
    
    console.log("RR", region, this.props.params)
    
    // do conditional rendering based on present filters
    if (this.regionShouldRender(region, this.props.params)) {
    return (
      <div id={region.id} className={`dash-region ${region.className || ''}`} key={region.id} >
        {this.getRegionTitle(region)}
        {
          region.children.map((component,j) => {
            if (Components.hasOwnProperty(component.type)) {
              const Component = Components[component.type]
              const componentData = this.getComponentData(component)
              const componentProps = Object.assign(component, {data: componentData, params: this.props.params, addlData: addlData})
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
    console.log('DASH', this)
    return (
      <div className="dashboard-container">
          {this.getRegions(this.props.regions)}
      </div>
    )
  }
}
