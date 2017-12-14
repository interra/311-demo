import React from 'react'
import BaseFilter from './BaseFilter'
import ReactSelect from './ReactSelect'
import cx from 'classnames/bind'

export default class Autocomplete extends BaseFilter {
  render(){
    let props = this.props
    let val = this.getFilterValue() || ''
    let label = props.label || 'Filter Label'
    let labelClass = (props.label) ? '' : 'sr-only'
    let { className } = this.props
    let inputProps = {}

    return (
      <div className={cx('autocomplete-filter-container', className)}>
        <label htmlFor={this.props.componentKey} className={labelClass}>{this.props.label}</label>
        <ReactSelect value={val} disabled={this.isDisabled(window.location.search)} {...props} onChange={this.onChange.bind(this)} key={this.props.componentKey} inputProps={inputProps} />
      </div>
    )
  }
}
