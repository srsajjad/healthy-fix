importScripts('https://www.gstatic.com/firebasejs/5.4.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.4.0/firebase-messaging.js')

var config = {
  apiKey: 'AIzaSyC7r9ojiFoXulNun1sNjl5JUPJq0wpC-so',
  authDomain: 'food-plan-35d93.firebaseapp.com',
  databaseURL: 'https://food-plan-35d93.firebaseio.com',
  projectId: 'food-plan-35d93',
  storageBucket: 'food-plan-35d93.appspot.com',
  messagingSenderId: '805163748650'
}
firebase.initializeApp(config)

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(payload => {
  const title = `It's Time To Eat`
  const options = {
    body: payload.data.status
  }
  return self.registration.showNotification(title, options)
})
