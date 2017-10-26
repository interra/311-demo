import React, { Component } from 'react';
import './App.css';
import Dashboard from './Dashboard.js'
import dashObject from './dashFromTest.json'

console.log(dashObject)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{"(O)pen(d)ata (V)isuals"}</h1>
        </header>
        <Dashboard {...dashObject} />
      </div>
    );
  }
}

export default App;
