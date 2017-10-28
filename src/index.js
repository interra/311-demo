import React from 'react'
import ReactDOM from 'react-dom'
import './stylesheets/App.css'
import './lib/font-awesome-4.7.0/css/font-awesome.min.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
