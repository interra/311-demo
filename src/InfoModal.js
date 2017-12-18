import React, { Component } from 'react'
import Modal from 'react-modal'

export default class InfoModal extends Component {
  render() {
    return (
    <Modal isOpen={this.props.infoWindowOpen}>
        <div className="info-window-content">
					<h1>Welcome to the 311 Dash Demo</h1>
				  <p class="close-modal doHover" onClick={this.props.toggleInfoWindow}>X</p>
          <div class="info-window-content-inner">
					<p>Welcome to the Philly 311 dashboard demo! Click around and feel free to leave feedback at our website: `https://interra.io`!</p>
          <h3>About this tools</h3>
          <p>This tool is built with our own stack utilizing a suite of current open source technologies:</p>
          <ul>
            <li><a href="#">React</a></li>
            <li><a href="#">Graphql</a></li>
            <li><a href="#">PostGis</a></li>
            <li><a href="#">Leaflet.js</a></li>
            <li><a href="#">Open Street Map</a></li>
          </ul>
          <p>This project also inherits from the <a href="#">react-dash</a> project. We hope to continue to develop this toolset in such a way that it is valuable to municipalities, citizens, members of the open source and open data communities, and developers leveraging open source technolgies.</p>
          <h3>About Open 311</h3>
          <p>We are using sample data from the Philly 311 API, which leverages the Open311 standard (link). This means that we can easily implement this dashboard for ANY city or municipality that leverages this standard.</p>
          <h3>Get in touch!</h3>
          <p>If you are interested in Open311, or open data generally,  have a look at these references:</p>
          <ul class="info-list">
            <li><a href="http://interria.io">Interra Open Data Catalog</a></li>
            <li><a href="http://wiki.open311.org/" target="_blank">Open 311 WIKI</a></li>
            <li><a href="https://www.opendataphilly.org/" target="_blank">Open Data Philly</a></li>
          </ul>
          <p>If you are interested in contributing or would like to discuss the project or you open data needs, please contact us:</p>
          <button mailto="pjwalker76@gmail.com">Contact Interra</button>
          </div>
        </div>
			</Modal>
      )
    }
}
