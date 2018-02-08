import React, {Component} from 'react'
import {Bar, Pie} from 'react-chartjs-2'

export default class Chart extends Component {
  doPieChart() {
    return <Pie data={this.props.data} options={this.props.chartOptions} />
  }

  doBarChart() {
    return <Bar data={this.props.data} options={this.props.chartOptions} />
  }
  
  render() {
    let chart

    console.log("CC", this.props)
    switch (this.props.settings.type) {
      case 'barChart':
        chart = this.doBarChart()
        break

      case 'pieChart':
        chart = this.doPieChart()
        break


    }

    return chart
  }
}
