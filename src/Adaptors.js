import { sortBy } from 'lodash'

export default class Adaptors {
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
    const xField = settings.series[0].x // use the same labels for all series
    const labels = data.map(row => row[xField])
    const datasets = settings.series.map(ser => {
      const _data = data.map(row => row[ser.y])
      const _settings = {
        borderColor: ser.border,
        borderWidth: ser.borderWidth,
        hoverBackgroundColor: ser.bgHover,
        hoverBorderColor: ser.borderHover,
        data: _data
      }

      // add any additional settings from config
      return Object.assign({}, ser, _settings)
    })

    console.log("dataset", datasets)

    return  {
      labels: labels,
      datasets: datasets
    }
  }

  getComponentData(component, data) {
      const cDatas = data.filter(item => {
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
  
  /**
   * Allow us to define arbitrary graphQL queries and use their
   * data in custom components
   **/
  getAddlData (component, data) {
    if (component.queryKey) {
      return data[component.queryKey]
    }

    return []
  }
}
