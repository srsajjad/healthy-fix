import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import RecipeTable from './RecipeTable'

function Transition (props) {
  return <Slide direction='up' {...props} />
}

class Recipe extends React.Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    return (
      <div>
        <Button
          style={{ backgroundColor: '#3f51b5', color: 'white' }}
          onClick={this.handleClickOpen}
        >
          Health Value Chart
        </Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle id='alert-dialog-slide-title'>
            {'Recipe Table'}
          </DialogTitle>
          <DialogContent>
            <RecipeTable />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default Recipe
