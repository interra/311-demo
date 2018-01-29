import React, { Component } from 'react'

export default class HoverInfo extends Component {
  render() {
    const hoverInfoStyle = {
      left: this.props.position.x + 20,
      top: this.props.position.y - 90 +20, // 90px == height of header
      display: this.props.active ? 'block' : 'none',
    }

    console.log("Hoverinfo",this);

    return (
      <div className="hoverinfo" style={hoverInfoStyle}>
        <table className="table table-inverse">
          <tbody>
            {this.props.rows.map(row => 
              <tr>
                <th scope="row">{row.key}</th>
                <td>{row.val}</td>
              </tr>
            )}
          </tbody>
        </table>
			</div>
    )
  }
}
