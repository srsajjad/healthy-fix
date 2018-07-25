import React from 'react'
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

function Login (props) {
  const { classes } = props

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
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>

          <TextField
            label='User Name'
            className={classes.textField}
            type='text'
            autoComplete='current-password'
            margin='normal'
          />

          <TextField
            label='Password'
            className={classes.textField}
            type='password'
            autoComplete='current-password'
            margin='normal'
            color='secondary'
          />

          <Button
            style={{ width: '200px', margin: 'auto', marginTop: '25px' }}
            variant='outlined'
            color='secondary'
            className={classes.button}
          >
            Login
          </Button>

        </CardContent>

      </Card>
    </div>
  )
}

export default withStyles(styles)(Login)
