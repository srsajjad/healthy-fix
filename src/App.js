import React, { Component } from 'react'
import MenuAppBar from './AppBar'
import Login from './Login'
import SignUp from './SignUp'
import Profile from './Profile'
import AllMeals from './AllMeals'
import Method from './Method'
import { Router, Link } from '@reach/router'

class App extends Component {
  state = { userInfo: {} }

  componentDidMount () {
    let token = localStorage.getItem('token')
    // console.log('token', token)
    window
      .fetch('http://localhost:1337/profile', {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: 'JWT ' + token
        }
      })
      .then(res => res.json())
      .then(res => {
        // console.dir(res)
        if (res.status === 'failed') {
          alert(res.message)
        } else if (res.status === 'success') {
          // console.log('response status', res.status)
          this.setState({
            userInfo: res.userInfo
          })
        }
      })
  }

  render () {
    // console.log('final state',this.state)
    return (
      <div className='App'>
        <MenuAppBar />

        {window.localStorage.getItem('token')
          ? <Router>
            <SignUp
              topic='update'
              path='/update'
              userInfo={this.state.userInfo}
              renderAgain={() => this.forceUpdate()}
              />
            <Profile
              path='/profile'
              userInfo={this.state.userInfo}
              />
            <AllMeals path='/allmeals' />
            <Method path='/method' />
            <AllMeals path='/' />
          </Router>
          : <Router>
            <SignUp
              topic='signup'
              path='/signup'
              renderAgain={() => this.forceUpdate()}
              />
            <Login path='/login' renderAgain={() => this.forceUpdate()} />
            <Login path='/' renderAgain={() => this.forceUpdate()} />
          </Router>}

      </div>
    )
  }
}

export default App
