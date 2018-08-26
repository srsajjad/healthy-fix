import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyC7r9ojiFoXulNun1sNjl5JUPJq0wpC-so',
  authDomain: 'food-plan-35d93.firebaseapp.com',
  databaseURL: 'https://food-plan-35d93.firebaseio.com',
  projectId: 'food-plan-35d93',
  storageBucket: 'food-plan-35d93.appspot.com',
  messagingSenderId: '805163748650'
}
firebase.initializeApp(config)

ReactDOM.render(<App firebase={firebase} />, document.getElementById('root'))
registerServiceWorker()
