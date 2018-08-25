import React, { Component } from 'react'
import { light } from '@material-ui/core/styles/createPalette'

export default class AdminMeal extends Component {
  render () {
    console.log(this.props.meals)
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%)`
        }}
      >
        {this.props.meals.length > 0 &&
          this.props.meals.map((n, i) => <li key={i}>{n.meal}</li>)}
      </div>
    )
  }
}
