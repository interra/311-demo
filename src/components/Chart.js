import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2'

export default class Chart extends Component {
  render() {
    return <Bar data={this.props.data} options={this.props.chartOptions} />
  }
}
