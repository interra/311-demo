import React, { Component } from 'react'
import queryString from 'query-string'

export default class BaseFilter extends Component {
  getAppliedFilters(q) {
      return queryString.parse(q, {arrayFormat: 'bracket'})
  }
  
  getFilterValue() {
    let val
    const q = (window.location.search) ? window.location.search.slice(1) : null
    let appliedFilters
    let ownFilters

    if (q) {
      appliedFilters = this.getAppliedFilters(q)
      ownFilters = appliedFilters[this.props.field] || ""
      console.log("OO",appliedFilters, ownFilters)
      if (this.isDisabled(appliedFilters)) {
        return []
      }
    }

    console.log(ownFilters, appliedFilters, q)


    if (ownFilters) {
      val = ownFilters
    } else if (this.props.initVal) {
      val = this.props.initVal
    } 
    
    return val
  }

  onChange(e) {
    console.log('onChange', e)
    const field = this.props.field
    let val = e.value
    
    const newFilter = {}

    if (this.props.multi) {
      val = e.map(item => item.value)
    } 
    newFilter[field] = val

    const newAppliedFilters = Object.assign(this.getAppliedFilters(window.location.search), newFilter)
    
    window.history.pushState("","", "?"+queryString.stringify(newAppliedFilters, {arrayFormat: 'bracket'}))

    this.forceUpdate()
    // write new url 
    // refetch data
  }

  // Check if the filter is disabled
  // Filters can be disabled via props, or if a specified filter is present
  // in applied filters
  isDisabled(appliedFilters) {
    let disabled = false

    if (this.props.disabled) disabled = true

    if (this.props.disabledBy && appliedFilters) {
      this.props.disabledBy.forEach(field => {
        if (appliedFilters[field]) disabled = true
      })
    }

    return disabled
  }

  /**
   * get autocomplete options
   */
  getOptions(input){
    let re = /\{\{(.+)\}\}/

    if(this.props.options) {
      return this.props.options
    } else if (this.props.data && this.props.data[0]) {
      return this.props.data[0]
    }

    return  []
  }
}
