import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

const styles = {
  card: {
    minWidth: 275,
    maxWidth: 500
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
}

class SignUp extends PureComponent {
  state = {
    name: '',
    password: '',
    age: '',
    loa: ''
  }

  // handleClick = () => {
  //   if (
  //     this.state.name.trim().length > 4 &&
  //     this.state.password.trim().length > 4
  //   ) {
  //   } else {
  //     alert('name and password can not be empty or less than 4 characters')
  //   }
  // }

  componentWillReceiveProps (nextProps) {
    let token = localStorage.getItem('token')
    if (token && this.props.topic === 'update') {
      this.setState({
        name: nextProps.userInfo.name,
        password: nextProps.userInfo.password,
        age: nextProps.userInfo.age,
        loa: nextProps.userInfo.loa
      })
    }
  }

  render () {
    const { classes, navigate, topic } = this.props
    // console.log('state inside signup', this.state)
    return (
      <div>
        <Card
          className={classes.card}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40%'
          }}
        >
          <CardContent>

            <form
              style={{ display: 'flex', flexDirection: 'column' }}
              onChange={e => {
                this.setState({
                  [e.target.name]: e.target.value
                })
              }}
              onSubmit={e => {
                e.preventDefault()

                if (this.props.topic === 'signup') {
                  window
                    .fetch('http://localhost:1337/auth/signup', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        name: this.state.name,
                        password: this.state.password,
                        age: this.state.age,
                        loa: this.state.loa
                      })
                    })
                    .then(res => res.json())
                    .then(res => {
                      if (res.status === 'failed') {
                        alert(res.message)
                      } else if (res.status === 'success') {
                        localStorage.setItem('token', res.token)
                        navigate('/')
                        this.props.renderAgain(res.token)
                      }
                    })
                } else if (this.props.topic === 'update') {
                  let token = localStorage.getItem('token')

                  window
                    .fetch('http://localhost:1337/me/update', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        Authorization: 'JWT ' + token
                      },
                      body: JSON.stringify({
                        name: this.state.name,
                        password: this.state.password,
                        age: this.state.age,
                        loa: this.state.loa
                      })
                    })
                    .then(res => res.json())
                    .then(res => {
                      if (res.status === 'failed') {
                        alert(res.message)
                      } else if (res.status === 'success') {
                        localStorage.setItem('token', res.token)
                        navigate('/')
                        this.props.renderAgain(res.token)
                      }
                    })

                  // console.log(this.state)
                }
              }}
            >
              <TextField
                label='Name'
                className={classes.textField}
                type='text'
                margin='normal'
                value={this.state.name}
                onChange={e => {
                  this.setState({
                    name: e.target.value
                  })
                }}
              />

              <TextField
                label='Password'
                value={this.state.password}
                className={classes.textField}
                type='password'
                margin='normal'
                onChange={e => {
                  this.setState({
                    password: e.target.value
                  })
                }}
              />

              <TextField
                value={this.state.age}
                label='Age'
                className={classes.textField}
                type='text'
                margin='normal'
                onChange={e => {
                  this.setState({
                    age: e.target.value
                  })
                }}
              />

              <TextField
                value={this.state.loa}
                label='Level Of Activity Out Of 10'
                className={classes.textField}
                type='text'
                margin='normal'
                onChange={e => {
                  this.setState({
                    loa: e.target.value
                  })
                }}
              />

              <Button
                type='submit'
                style={{ width: '200px', margin: 'auto', marginTop: '25px' }}
                variant='outlined'
                color='secondary'
                className={classes.button}
              >
                {topic === 'signup' ? 'Sign Up' : 'Update'}
              </Button>

            </form>

          </CardContent>

        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(SignUp)
