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
              <p class="text-h3">
                Welcome to the future - data is everywhere, the digital divide recedes before our very eyes, and we stand on the brink of.... confusion? Given the power of accessible open source technologies, we think that we can do better! We've wired this demo to give just a taste of what can be done with open data and open source technologies on the web.</p>
            </div>
          </div>

        <div className="info-row">
          <div className="row text-left align-items-center pt-5 pb-md-5">
            <div className="col-4 col-md-5">
              <img alt="image" className="img-fluid" src={phillyLogo}/>
            </div>

            <div className="col-12 col-md-5 m-md-auto">
              <h2><strong>Philly Open 311</strong></h2>
              <p class="text-h3">Open standards are on the rise. Cities, organizations, and governments are quickly adopting them as they realize that it allows them to leverage powerful existing tools. Philly's Open311 project, utilizing the Open 311 standard, is just an example.</p>
              <p><a href="http://www.phila.gov/311">Learn More &gt;</a></p>
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
              <p className="text-h3">Geospatial data is (literally) everywhere. Data is not just in rows and columns anymore: it is on streets and corners, and it follows us around everywhere we go. What does this data tell us about our lives, our cities, our societies? Let's find out!</p>
              <p><a href="http://postgis.net/">Learn More &gt;</a></p>
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
              <p className="text-h3">Technology is getting better - APIs are getting smarter, and the way that we can share and access data is improving. GraphQL is the latest and greatest, and makes accessing complex data into a sensible task.</p>
              <a href="http://graphql.org/">Learn More &gt;</a>
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
              <p className="text-h3">We utilize a suite of front-end tools to bring intuitive user experience to everyday people. Understanding data shouldn't feel like doing taxes, nor should it require a PHD. Information wants to be free and we have the tools to do it.</p>
              <a href="https://reactjs.org/">Learn More &gt;</a>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-5 m-md-auto">
            <p className="text-h3">If you want more info about this project, the tools that we are using, or if you are interested to discuss a data visualization project, get in touch!</p>
          <button mailto="pjwalker76@gmail.com">CONTACT</button>
          </div>
        </div>
       
       </div>
      </section>		
		</Modal>
      )
    }
}
