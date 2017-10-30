import React, { Component } from 'react'
import { paramsFromQ, objToQueryString } from '../paramRouting'

export default class BaseFilter extends Component {

  appliedFilters = {}
  ownFilters = {}
  
  q = (window.location.search) ? window.location.search.slice(1) : null
  
  componentWillMount() {
    if (this.q) {
      this.appliedFilters = paramsFromQ(this.q)
      this.ownFilters = this.appliedFilters[this.props.field] || ""
    }
    
    console.log("field", this.props.field)
    console.log('Apf', this.appliedFilters, this.ownFilters)
  }
  
  getFilterValue() {
    let val

    if (this.isDisabled()) {
      return []
    }

    if (this.ownFilters) {
      val = this.ownFilters
    } else if (this.props.initVal) {
      val = this.props.initVal
    } else if (this.props.options) {
      val = this.props.options[0].value
    }
    
    return val
  }

  onChange(e) {
    console.log(e)
    const field = this.props.field
    const val = e.value
    const newFilter = {}
    newFilter[field] = val
    const newAppliedFilters = Object.assign(this.appliedFilters, newFilter)
    
    window.history.pushState("","", "?"+objToQueryString(newAppliedFilters))
    // write new url 
    // refetch data
  }

  // Check if the filter is disabled
  // Filters can be disabled via props, or if a specified filter is present
  // in applied filters
  isDisabled() {
    let disabled = false

    if (this.props.disabled) disabled = true

    if (this.props.disabledBy) {
      this.props.disabledBy.forEach(field => {
        if (this.appliedFilters[field]) disabled = true
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
