// importis
import React, { Component } from 'react'
import Meal from './Meal'
import img1 from './static/images/cards/img1.jpg'
import img2 from './static/images/cards/img2.jpg'
import img3 from './static/images/cards/img3.jpg'
import img4 from './static/images/cards/img4.jpg'
import img5 from './static/images/cards/img5.jpg'
import './AllMeals.css'

class App extends Component {
  // whole state of the app
  state = {}

  // handler functions

  componentDidMount () {
    // api calls on first load
  }

  render () {
    let imageArr = [img1, img2, img3, img4, img5]
    return (
      <div className='card-parent'>
        {imageArr.map(n => <Meal imgName={n} />)}
      </div>
    )
  }
}

export default App
