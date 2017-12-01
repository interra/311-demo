import React from 'react'
import ReactDOM from 'react-dom'
import './stylesheets/App.css'
import './lib/font-awesome-4.7.0/css/font-awesome.min.css'
import App from './App'

import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'

import { ApolloProvider } from 'react-apollo'
import {ApolloClient} from 'apollo-client'

// should prob use ENV
const API_URI = "http://45.79.171.179:3333/graphql/"
const client = new ApolloClient({
  link: new HttpLink({uri: API_URI}),
  cache: new InMemoryCache()
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
), document.getElementById('root'))
