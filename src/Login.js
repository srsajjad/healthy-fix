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

class Login extends PureComponent {
  state = {
    name: '',
    password: ''
  }

  handleClick = () => {
    let self = this
    if (
      this.state.name.trim().length > 4 &&
      this.state.password.trim().length > 4
    ) {
      console.log('Alright !')

      window
        .fetch('http://localhost:1337/auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.state.name,
            password: this.state.password
          })
        })
        .then(res => res.json())
        .then(res => {
          // console.dir(res)
          if (res.status === 'failed') {
            alert(res.message)
          } else if (res.status === 'success') {
            localStorage.setItem('token', res.token)
            this.props.renderAgain()
          }
        })
    } else {
      alert('name and password can not be empty or less than 4 characters')
    }
  }

  render () {
    const { classes, navigate } = this.props

    return (
      <div>
        <Card
          className={classes.card}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            borderRadius: '11px'
          }}
        >
          <CardContent style={{ display: 'flex', flexDirection: 'column' }}>

            <TextField
              label='User Name'
              className={classes.textField}
              type='text'
              autoComplete='current-password'
              margin='normal'
              onChange={e => {
                this.setState({
                  name: e.target.value
                })
              }}
            />

            <TextField
              label='Password'
              className={classes.textField}
              type='password'
              autoComplete='current-password'
              margin='normal'
              color='secondary'
              onChange={e => {
                this.setState({
                  password: e.target.value
                })
              }}
            />

            <Button
              style={{ width: '200px', margin: 'auto', marginTop: '25px' }}
              variant='outlined'
              color='secondary'
              className={classes.button}
              onClick={this.handleClick}
            >
              Login
            </Button>

          </CardContent>

        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(Login)
