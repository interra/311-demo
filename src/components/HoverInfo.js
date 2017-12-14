import React from 'react'
import PropTypes from 'prop-types'

const HoverInfo = (props) => {
  const hoverInfoStyle = {
    left: props.position.x + 20,
    top: props.position.y - 90 +20, // 90px == height of header
    display: props.active ? 'block' : 'none',
  }

  return (
    <div className="hoverinfo" style={hoverInfoStyle}>
      <p>{props.name}</p>
      <p>{props.value}</p>
    </div>
  )
}

HoverInfo.propTypes = {
  position: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default HoverInfo
