import React from 'react'
import BaseFilter from './BaseFilter'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class DateFilter extends BaseFilter {
  render(){
    console.log(this)
    return <DatePicker onChange={this.onChange.bind(this)} />
  }
}
