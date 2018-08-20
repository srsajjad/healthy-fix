import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import './Admin.css'

export default class Admin extends Component {
  state = {
    mealOpen: false,
    recipeOpen: false,
    mealName: '',
    recipeKey: '',
    recipes: [],
    showNewRecipeKey: false,
    secretKey: '',
    barOpen: false,
    msg: 'WhooHoo!',
    showSpinner: false
  }

  handleBarClose = e => {
    this.setState({
      barOpen: false,
      showSpinner: false
    })
  }

  handleMealChange = e => {
    let melaName = e.target.value
    this.setState({
      [e.target.name]: melaName
    })

    window
      .fetch(`http://localhost:1337/mealplan/recipe/${melaName}`, {
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
          // alert(res.message)
          this.setState({
            msg: res.message,
            barOpen: true
          })
        } else if (res.status === 'success') {
          //   console.log('response', res)
          this.setState({
            recipes: res.recipes,
            showNewRecipeKey: true
          })
        }
      })
  }

  handleRecipeChange = e => {
    let recipeKey = e.target.value
    this.setState({
      [e.target.name]: recipeKey
    })
    window
      .fetch(`http://localhost:1337/recipe/${recipeKey}`, {
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
          // alert(res.message)
          this.setState({
            msg: res.message,
            barOpen: true
          })
        } else if (res.status === 'success') {
          //   console.log('response', res)
          this.setState({
            recipeText: res.recipeText
          })
        }
      })
  }

  handleSubmit = e => {
    e.preventDefault()
    document.querySelector('.submit-btn').disabled = true
    this.setState({
      showSpinner: true
    })

    let { secretKey, mealName, recipeKey, recipeText } = this.state
    // console.log({ secretKey, mealName, recipeKey, recipeText })

    if (
      secretKey.trim() &&
      mealName.trim() &&
      recipeKey.trim() &&
      recipeText.trim()
    ) {
      window
        .fetch('http://localhost:1337/mealplan/recipe', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            secretKey,
            mealName,
            recipeKey,
            recipeText
          })
        })
        .then(res => res.json())
        .then(res => {
          document.querySelector('.submit-btn').disabled = false
          this.setState({
            showSpinner: false
          })
          if (res.status === 'falseKey') {
            // alert(res.message)
            this.setState({
              msg: res.message,
              barOpen: true
            })
          }
          if (res.status === 'success') {
            this.setState({
              msg: res.message,
              barOpen: true,
              recipeText: '',
              mealName: '',
              recipeKey: ''
            })
          }
          console.log(res)
        })
        .catch(err => console.log('error occured', err))
    } else {
      // alert('Provide All Info Correctly')
      this.setState({
        msg: 'Provide All Info Correctly',
        barOpen: true
      })
    }
  }

  render () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id='secretKey'
            label='Admin Secret Key'
            value={this.state.secretKey}
            onChange={e => this.setState({ secretKey: e.target.value })}
            margin='normal'
          />
          <br />
          <br />
          <Select
            style={{ width: '261px' }}
            open={this.state.mealOpen}
            onClose={() => this.setState({ mealOpen: false })}
            onOpen={() => this.setState({ mealOpen: true })}
            value={this.state.mealName}
            onChange={this.handleMealChange}
            inputProps={{
              name: 'mealName',
              id: 'demo-controlled-open-select'
            }}
          >
            {this.props.meals.map(n => {
              return <MenuItem value={n.meal}>{n.meal}</MenuItem>
            })}
          </Select>

          <br />
          <br />

          {this.state.showNewRecipeKey &&
            <div>
              <Select
                style={{ width: '261px' }}
                open={this.state.recipeOpen}
                onClose={() => this.setState({ recipeOpen: false })}
                onOpen={() => this.setState({ recipeOpen: true })}
                value={this.state.recipeKey}
                onChange={this.handleRecipeChange}
                inputProps={{
                  name: 'recipeKey',
                  id: 'demo-controlled-open-select'
                }}
              >
                {this.state.recipes.map(n => {
                  return <MenuItem value={n}>{n}</MenuItem>
                })}
              </Select>

              <br />

              <TextField
                id='newReciepeKey'
                label='Or Add A New ReciepeKey'
                value={this.state.recipeKey}
                onChange={e => this.setState({ recipeKey: e.target.value })}
                margin='normal'
              />
              <br />
              <br />
              <br />

              <textarea
                name=''
                id=''
                cols='30'
                rows='10'
                value={this.state.recipeText}
                onChange={e =>
                  this.setState({
                    recipeText: e.target.value
                  })}
              />
              <br />
              <br />

              <Button
                className='submit-btn'
                type='submit'
                variant='outlined'
                color='secondary'
                onClick={this.handleSubmit}
              >
                {this.state.showSpinner
                  ? <div className='spinner' />
                  : <span>Add Recipe</span>}
              </Button>
            </div>}

        </form>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.barOpen}
          autoHideDuration={6000}
          onClose={this.handleBarClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id='message-id'>{this.state.msg}</span>}
          action={[
            <IconButton
              key='close'
              aria-label='Close'
              color='inherit'
              onClick={this.handleBarClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    )
  }
}
