import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Check'
import SaveIcon from '@material-ui/icons/Save'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})

class Subscribe extends React.Component {
  timer = null

  state = {
    loading: false,
    success: false
  }

  handleButtonClick = e => {
    let target = e.target
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true
        },
        () => {
          let token = localStorage.getItem('token')
          let meal = this.props.mealName

          if (target.innerHTML === 'Subscribe') {
            window
              .fetch('http://localhost:1337/mealplan/subscribe', {
                method: 'POST',
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  Authorization: 'JWT ' + token
                },
                body: JSON.stringify({
                  meal: meal
                })
              })
              .then(res => res.json())
              .then(res => {
                if (res.status === 'failed') {
                  alert(res.message)
                } else if (res.status === 'success') {
                  this.setState({
                    loading: false,
                    success: true
                  })

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
                        // console.log('response', res)
                        this.props.renderAgain(res.userInfo)
                      }
                    })
                }
              })
          } else {
            window
              .fetch('http://localhost:1337/mealplan/unsubscribe', {
                method: 'POST',
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  Authorization: 'JWT ' + token
                },
                body: JSON.stringify({
                  meal: meal
                })
              })
              .then(res => res.json())
              .then(res => {
                if (res.status === 'failed') {
                  alert(res.message)
                } else if (res.status === 'success') {
                  this.setState({
                    loading: false,
                    success: true,
                    buttonName: 'Subscribe'
                  })

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
                        this.props.renderAgain(res.userInfo)
                      }
                    })
                }
              })
          }
        }
      )
    }
  }

  render () {
    const { loading, success } = this.state
    const { classes, mealName, userMeals } = this.props
    let meal = mealName
    // console.log('user meals', userMeals)
    // console.log('meal', meal)
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success
    })

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Button
            variant='contained'
            color='primary'
            className={buttonClassname}
            disabled={loading}
            onClick={this.handleButtonClick}
          >
            {userMeals.includes(meal) ? 'Unsubscribe' : 'Subscribe'}
          </Button>
          {loading &&
            <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Subscribe)
