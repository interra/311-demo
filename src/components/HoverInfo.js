import React, { Component } from 'react'

export default class HoverInfo extends Component {
  render() {
    const hoverInfoStyle = {
      left: this.props.position.x + 20,
      top: this.props.position.y - 90 +20, // 90px == height of header
      display: this.props.active ? 'block' : 'none',
    }

    return (
      <div className="hoverinfo" style={hoverInfoStyle}>
        <p>{this.props.name}</p>
        <p>{this.props.value}</p>
      </div>
    )
  }
}
