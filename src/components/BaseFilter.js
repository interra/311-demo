import { Component } from 'react'
import queryString from 'query-string'

export default class BaseFilter extends Component {
  getFilterValue() {
    let val
    const q = this.props.params
		let appliedFilters
    let ownFilters

    if (q) {
      ownFilters = q[this.props.filterKey] || ""
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

  // onChange should listen to the componenet and update the url params only
	onChange(e) {
    this.doOnChange(e)
  }
  
  // so we can call this manually
  doOnChange(e) {
    const filterKey = this.props.filterKey
    let val = (e) ? e.value : []
    const newFilter = {}

    if (this.props.multi) {
      val = e.map(item => {
        return item.value
      })
    }

    newFilter[filterKey] = val

    const newAppliedFilters = Object.assign(this.props.params, newFilter)
    
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
    const appliedFilters = this.props.params

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
    if(this.props.options) {
      return this.props.options
    } else if (this.props.data && this.props.data[0]) {
      return this.props.data[0]
    }

    return  []
  }
}
