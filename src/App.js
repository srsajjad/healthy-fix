import React, { Component } from 'react'
import MenuAppBar from './AppBar'
import Login from './Login'
import SignUp from './SignUp'
import Profile from './Profile'
import AllMeals from './AllMeals'
import Method from './Method'
import { Router, Link } from '@reach/router'

class App extends Component {
  state = {}

  componentDidMount () {}

  render () {
    return (
      <div className='App'>
        <MenuAppBar />
        <Router>
          <Login path='/login' />
          <SignUp path='/signup' />
          <Profile path='/profile' />
          <AllMeals path='/allmeals' />
          <Method path='/method' />
        </Router>
      </div>
    )
  }
}

export default App
