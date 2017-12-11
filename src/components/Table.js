import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Table extends Component{
  render() {
    console.log('TABLE', this)
    const cols = this.props.settings.columns
    const data = this.props.data
    return <ReactTable data={data} columns={cols} />
  }
}
