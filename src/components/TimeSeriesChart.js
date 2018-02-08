import React, { Component } from 'react'
import {Line} from 'react-chartjs-2'
import {groupBy} from 'lodash'

const defaultDataset =
    {
      fill: false,
      pointHoverBorderWidth: 2,
      borderWidth: 2,
      pointRadius: 2,
      pointHitRadius: 25,
      pointBorderWidth: 2,
      pointHoverRadius: 4,
    }

// select which series to show by default
const showSeries = ['CRIMINAL ALLEGATION', 'PHYSICAL ABUSE']

export default class TimeSeriesChart extends Component{
  constructor(props) {
    super(props)
    this.state = {hasData: 0}
  }
  
  componentDidMount() {
    console.log("TSC", this.props)
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.hasData) {
      const hasData = typeof this.props.addlData.getTimeSeriesData
      if (hasData) this.setState({hasData: hasData})
    }
  }

  // return array of sorted date strings
  getLabels(data) {
    return data.map(r => {
      const d = new Date(`${r.mon} ${r.year}`)
      return Object.assign({}, r, {d: d})
    }).sort((a,b) => a.d - b.d).map(rr => `${rr.mon} ${rr.year}`)
  }

  getDatasets(data, labels) {
    const arrs = groupBy(data, "general_cap_classification") || []
    console.log("ASAS", arrs)
    const colors = ['rgba(157,87,87,1)', 'rgba(166,101,123,1)', 'rgba(157,123,157,1)', 'rgba(132,147,182,1)','rgb(99,171,190)','rgb(86,192,179)', 'rgb(114,208,155)', 'rgb(166,219,127)', 'rgb(228,223,109)','rgb(190,152,197)', 'rgb(117,171,204)', 'rgb(106,181,117)', 'rgb(166,170,75)','rgb(219,150,77)']

    return Object.keys(arrs).map((key,i) => {
      let mine = {
        label: key,
        data: arrs[key].map(r => { return {x: `"${r.mon} ${r.year}"`, y: r.count}}),
        borderColor: colors[i]
      }

      if (!showSeries.includes(key)) mine.hidden = true

      const dataset = Object.assign({}, defaultDataset, mine)
      return dataset
    })
  }
  
  // Note this is based on the graphql API return data shape
  getData() {
    const raw = this.props.addlData.getTimeSeriesData[0][0]
    const labeldata = this.props.addlData.getTimeSeriesData[1][0]
    const labels = this.getLabels(labeldata)
    const datasets = this.getDatasets(raw, labels)
    console.log("DS", datasets)
    return { labels: labels, datasets: datasets }
  }
  
  render() {
    console.log("hasData??", this.state.hasData)
    const options = {
        height: 500,
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: 'white',
                fontSize: 14
            }
        }
    }

    if (this.state.hasData) {
      return (
        <Line data={this.getData.bind(this)} options={options} />
      )
    } else {
      return null
    }
  }
}
