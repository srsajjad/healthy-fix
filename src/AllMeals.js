// importis
import React, { Component } from 'react'
import Meal from './Meal'
import img1 from './static/images/cards/img1.jpg'
import img2 from './static/images/cards/img2.jpg'
import img3 from './static/images/cards/img3.jpg'
import img4 from './static/images/cards/img4.jpg'
import img5 from './static/images/cards/img5.jpg'
import img6 from './static/images/cards/img1.jpg'
import './AllMeals.css'

class AllMeals extends Component {
  // state = {
  //   meals: this.props.meals,
  //   userMeals: this.props.userMeals
  // }

  // handler functions

  // componentWillReceiveProps (nextProps) {
  //   this.setState({
  //     meals: nextProps.meals,
  //     userMeals: nextProps.userMeals
  //   })
  // }

  render () {
    let imageArr = [img1, img2, img3, img4, img5, img6]
    return (
      <div className='card-parent'>
        {this.props.meals.length > 0 &&
          this.props.meals.map((n, i) => (
            <Meal
              navigate={this.props.navigate}
              meal={n}
              imgName={imageArr[i]}
              userMeals={this.props.userMeals}
              renderAgain={userInfo => this.props.renderAgain(userInfo)}
            />
          ))}
      </div>
    )
  }
}

export default AllMeals
