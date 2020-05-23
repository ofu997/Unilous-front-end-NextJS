import { withApollo } from "next-apollo"
// import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost"

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
// https://unilous-back-end-dev.herokuapp.com/graphql
// https://projectu-back-end-2020.herokuapp.com/graphql

const httpLink = createHttpLink({
  uri: 'https://projectu-back-end-2020.herokuapp.com/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = null
  // const token = localStorage.getItem('token')
  return {
      headers: {
          ...headers,
          authorization: token ? `berySecret ${token}` : null,
      }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// const apolloClient = new ApolloClient({
//   uri: 'https://projectu-back-end-2020.herokuapp.com/graphql',
//   cache: new InMemoryCache(),
//   ssrMode: true
// })

export default withApollo(apolloClient)
