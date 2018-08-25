import React, { Component } from 'react'
import MenuAppBar from './AppBar'
import Login from './Login'
import SignUp from './SignUp'
import Profile from './Profile'
import AllMeals from './AllMeals'
import Method from './Method'
import AdminRecipe from './AdminRecipe'
import AdminMeal from './AdminMeal'
import { Router, Link, navigate } from '@reach/router'

class App extends Component {
  state = { userInfo: {}, meals: [], allRecipes: [] }

  fetchUsers = token => {
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

  fetchMeals = () => {
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

  fetchRecipe = () => {
    window
      .fetch('http://localhost:1337/recipe', {
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
          console.log('recipe array response', res)
          this.setState({
            allRecipes: res.allRecipes
          })
        }
      })
  }

  componentDidMount () {
    let token = localStorage.getItem('token')
    if (token) this.fetchUsers(token)
    this.fetchMeals()
    this.fetchRecipe()
  }

  render () {
    return (
      <div className='App'>

        <MenuAppBar renderAgain={() => this.forceUpdate()} /><br />
        <Router>
          <AdminRecipe
            updateRecipe={() => this.fetchRecipe()}
            path='/admin/add-recipe'
            meals={this.state.meals}
          />
        </Router>
        <Router>
          <AdminMeal path='/admin/add-meal' meals={this.state.meals} />
        </Router>

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
            <Method
              path='/method/:mealName'
              allRecipes={this.state.allRecipes}
              />
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
