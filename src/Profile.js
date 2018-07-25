// importis
import React, { Component } from 'react'
import './Profile.css'

class Profile extends Component {
  // whole state of the app
  state = {}

  // handler functions

  componentDidMount () {
    // api calls on first load
  }

  render () {
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
              Arafat Wasi
            </h1>

            <h2>
              25 Years Old
            </h2>

            <h2>
              7 / 10
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
