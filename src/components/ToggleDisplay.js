import React from 'react'
import PropTypes from 'prop-types'

function isDefined(value) {
  if (typeof value === 'undefined') return false
  if (value === null) return false
  return true
}

function shouldShow(props) {
  const { show, hide } = props
  if (isDefined(show)) return show
  if (isDefined(hide)) return !hide
  return false;
}

function ToggleDisplay(props) {
  const {
    render
  } = props;
  if (shouldShow(props)) {
    return render()
  }
  return null
}

ToggleDisplay.propTypes = {
  hide: PropTypes.bool,
  show: PropTypes.bool,
  render: PropTypes.func.isRequired
};

export default ToggleDisplay
