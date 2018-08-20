import React, { Component } from 'react'
import MenuAppBar from './AppBar'
import Login from './Login'
import SignUp from './SignUp'
import Profile from './Profile'
import AllMeals from './AllMeals'
import Method from './Method'
import Admin from './Admin'
import { Router, Link, navigate } from '@reach/router'

class App extends Component {
  state = { userInfo: {}, meals: [] }

  componentDidMount () {
    let token = localStorage.getItem('token')

    if (token) {
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

    window
      .fetch('http://localhost:1337/mealplan/meals', {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        // console.dir(res)
        if (res.status === 'failed') {
          alert(res.message)
        } else if (res.status === 'success') {
          // console.log('response', res)
          this.setState({
            meals: res.meals
          })
        }
      })
  }

  render () {
    // console.log('final state', this.state)

    // console.log('i was rendered again')

    return (
      <div className='App'>

        <MenuAppBar renderAgain={() => this.forceUpdate()} /><br />
        <Router><Admin path='/admin' meals={this.state.meals} /></Router>

        {window.localStorage.getItem('token')
          ? <Router>
            <SignUp
              topic='update'
              path='/update'
              userInfo={this.state.userInfo}
              renderAgain={userInfo =>
                  this.setState({
                    userInfo: userInfo
                  })}
              />
            <Profile path='/profile' userInfo={this.state.userInfo} />
            <AllMeals
              path='/allmeals'
              meals={this.state.meals}
              userMeals={
                  this.state.userInfo['meals'] ? this.state.userInfo.meals : []
                }
              renderAgain={userInfo =>
                  this.setState({
                    userInfo: userInfo
                  })}
              />
            <Method path='/method' />
            <AllMeals
              path='/'
              meals={
                  this.state.userInfo['meals']
                    ? this.state.meals.filter(n =>
                        this.state.userInfo['meals'].includes(n.meal)
                      )
                    : []
                }
              userMeals={
                  this.state.userInfo['meals'] ? this.state.userInfo.meals : []
                }
              renderAgain={userInfo =>
                  this.setState({
                    userInfo: userInfo
                  })}
              />
          </Router>
          : <Router>
            <SignUp
              topic='signup'
              path='/signup'
              renderAgain={userInfo =>
                  this.setState({
                    userInfo: userInfo
                  })}
              />
            <Login
              path='/login'
              renderAgain={userInfo => {
                this.setState({
                  userInfo: userInfo
                })
                setTimeout(() => this.forceUpdate(), 300)
              }}
              />
            <Login
              path='/'
              renderAgain={userInfo => {
                this.setState({
                  userInfo: userInfo
                })
                setTimeout(() => this.forceUpdate(), 300)
              }}
              />
          </Router>}

      </div>
    )
  }
}

export default App
