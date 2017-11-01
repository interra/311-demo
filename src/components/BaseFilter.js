import React, { Component } from 'react'
import queryString from 'query-string'

export default class BaseFilter extends Component {
  getAppliedFilters(q) {
      // @@TODO need to filter out disabled filter values
      const queryObj = queryString.parse(q, {arrayFormat: 'bracket'})
      return queryObj
  }

  getFilterValue() {
    let val
    const history = this.props.history
    const q = (history.location.search) ? history.location.search.slice(1) : null
    let appliedFilters
    let ownFilters

    if (q) {
      appliedFilters = this.getAppliedFilters(q)
      ownFilters = appliedFilters[this.props.filterKey] || ""
      if (this.isDisabled(appliedFilters)) {
        return []
      }
    }

    if (ownFilters) {
      val = ownFilters
    } else if (this.props.initVal) {
      val = this.props.initVal
    } 
    
    return val
  }

  onChange(e) {
    const filterKey = this.props.filterKey
    const history = this.props.history
    let val = e.value
    const newFilter = {}

    if (this.props.multi) {
      val = e.map(item => item.value)
    }
    newFilter[filterKey] = val

    const newAppliedFilters = Object.assign(this.getAppliedFilters(history.location.search), newFilter)
    
    const newQuery = "?"+queryString.stringify(newAppliedFilters, {arrayFormat: 'bracket'})

    this.props.history.push({
      pathname: '/',
      search: newQuery
    })
  }

  // Check if the filter is disabled
  // Filters can be disabled via props, or if a specified filter is present
  // in applied filters
  isDisabled(q) {
    let disabled = false
    const appliedFilters = this.getAppliedFilters(q)

    if (this.props.disabled) disabled = true

    if (this.props.disabledBy && appliedFilters) {
      this.props.disabledBy.forEach(filterKey => {
        if (appliedFilters[filterKey]) disabled = true
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
