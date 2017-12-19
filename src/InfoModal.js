import React, { Component } from 'react'
import Modal from 'react-modal'
import gqlLogo from './images/logos/graphql-logo.svg'
import reactLogo from './images/logos/react-logo.png'
import phillyLogo from './images/logos/philly-bell-logo.png'
import nodeLogo from './images/logos/node-logo.png'
import postGISLogo from './images/logos/postgis-logo.png'

export default class InfoModal extends Component {
  render() {
    const toggleInfoWindow = this.props.toggleInfoWindow
    return (
    <Modal isOpen={this.props.infoWindowOpen}>
      <section className="fdb-block">
        <span className="close-modal doHover" onClick={toggleInfoWindow}>X</span>
        <div className="container">
          <div className="row justify-content-center pb-5">
            <div className="col-12 text-center">
              <h1>Open Data Visualization</h1>
              <p class="text-h3">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
            </div>
          </div>

        <div className="info-row">
          <div className="row text-left align-items-center pt-5 pb-md-5">
            <div className="col-4 col-md-5">
              <img alt="image" className="img-fluid" src={phillyLogo}/>
            </div>

            <div className="col-12 col-md-5 m-md-auto">
              <h2><strong>Philly Open 311</strong></h2>
              <p class="text-h3">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
              <p><a href="https://www.froala.com">Learn More &gt;</a></p>
            </div>
          </div>
        </div>

        <div className="info-row">
          <div className="row text-left align-items-center pt-5 pb-md-5">
            <div className="col-4 col-md-5 m-md-auto order-md-5">
              <img alt="image" className="img-fluid indent" src={postGISLogo}/>
            </div>

            <div className="col-12 col-md-5">
              <h2><strong>Geospatial Data</strong></h2>
              <p className="text-h3">Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
              <p><a href="https://www.froala.com">Learn More &gt;</a></p>
            </div>
          </div>
      </div>

        <div className="info-row">
          <div className="row text-left align-items-center pt-5">
            <div className="col-4 col-md-5">
              <img alt="image" className="img-fluid indent" src={gqlLogo}/>
            </div>

            <div className="col-12 col-md-5 m-md-auto">
              <h2><strong>GraphQL</strong></h2>
              <p className="text-h3">On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word "and" and the Little Blind Text should turn around.</p>
              <p><a href="https://www.froala.com">Learn More &gt;</a></p>
            </div>
         </div> 
        </div>
          
        <div className="info-row">
          <div className="row text-left align-items-center pt-5">
            <div className="col-4 col-md-5">
              <img alt="image" className="img-fluid indent" src={reactLogo}/>
            </div>

            <div className="col-12 col-md-5 m-md-auto">
              <h2><strong>React</strong></h2>
              <p className="text-h3">On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything that was left from its origin would be the word "and" and the Little Blind Text should turn around.</p>
              <p><a href="https://www.froala.com">Learn More &gt;</a></p>
            </div>
          </div>
        </div>
       </div>
      </section>		
		</Modal>
      )
    }
}
