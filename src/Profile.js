// importis
import React, { Component } from 'react'
import './Profile.css'

class Profile extends Component {
  // whole state of the app
  state = {
    userInfo: {}
  }

  // handler functions

  // componentDidMount () {
  //   let token = localStorage.getItem('token')

  //   window
  //     .fetch('http://localhost:1337/profile', {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json',
  //         Authorization: 'JWT ' + token
  //       }
  //     })
  //     .then(res => res.json())
  //     .then(res => {
  //       if (res.status === 'failed') {
  //         alert(res.message)
  //       } else if (res.status === 'success') {
  //         console.dir(this.state)
  //         this.setState({
  //           userInfo: res.userInfo
  //         })
  //         this.props.renderAgain(res.userInfo)
  //       }
  //     })
  // }

  // getSnapshotBeforeUpdate = (props, prevState) => {
  //   console.log('prev props', props)
  //   return {
  //     userInfo: props.userInfo
  //   }
  // }

  componentWillReceiveProps (nextProps) {
    // console.log('next props', nextProps)
    this.setState({
      userInfo: nextProps.userInfo
    })
  }

  render () {
    // console.log('state of profile', this.state)
    return (
      <div>
        <aside class='profile-card'>
          <div className='header'>

            <a target='_blank' href='#'>
              <img
                src='http://lorempixel.com/150/150/people/'
                className='hoverZoomLink'
              />
            </a>

            <h1>
              {this.state.userInfo.name}
            </h1>

            <h2>
              Age: {this.state.userInfo.age}
            </h2>

            <h2>
              Level Of Activity: {this.state.userInfo.loa} / 10
            </h2>

          </div>

          <div class='profile-bio'>

            <p>
              It takes monumental improvement for us to change how we live our lives. Eat Healthy ! Live Healthy !
            </p>

          </div>

        </aside>
      </div>
    )
  }
}

export default Profile
