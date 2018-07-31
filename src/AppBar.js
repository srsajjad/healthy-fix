import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import Home from '@material-ui/icons/Home'
import AccountBox from '@material-ui/icons/AccountBox'
import LocalDining from '@material-ui/icons/LocalDining'
import Create from '@material-ui/icons/Create'
import { navigate } from '@reach/router'

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    left: false
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    })
  }

  //   handleChange = (event, checked) => {
  //     this.setState({ auth: checked })
  //   }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  render () {
    const { classes, renderAgain } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    const sideList = (
      <div className={classes.list}>

        <ListItem
          button
          onClick={async () => {
            await navigate('/')
            renderAgain()
          }}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary='Home' />
        </ListItem>

        <ListItem
          button
          onClick={async () => {
            await navigate('/profile')
            renderAgain()
          }}
        >
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText primary='Profile' />
        </ListItem>

        <ListItem
          button
          onClick={async () => {
            await navigate('/update')
            renderAgain()
          }}
        >
          <ListItemIcon>
            <Create />
          </ListItemIcon>
          <ListItemText primary='Update Info' />
        </ListItem>

        <ListItem
          button
          onClick={async () => {
            await navigate('/allmeals')
            renderAgain()
          }}
        >
          <ListItemIcon>
            <LocalDining />
          </ListItemIcon>
          <ListItemText primary='All Meal Plans' />
        </ListItem>
      </div>
    )

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color='inherit'
              aria-label='Menu'
              onClick={this.toggleDrawer('left', true)}
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              open={this.state.left}
              onClose={this.toggleDrawer('left', false)}
              onOpen={this.toggleDrawer('left', true)}
            >
              <div
                tabIndex={0}
                role='button'
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
              >
                {sideList}
              </div>
            </SwipeableDrawer>
            <Typography
              variant='title'
              color='inherit'
              className={classes.flex}
            >
              Healthy Fix
            </Typography>
            {auth &&
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup='true'
                  onClick={this.handleMenu}
                  color='inherit'
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  {/* {localStorage.token &&
                    <MenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </MenuItem>} */}
                  {!localStorage.token &&
                    <MenuItem onClick={() => navigate('/login')}>
                      LogIn
                    </MenuItem>}
                  {!localStorage.token &&
                    <MenuItem onClick={() => navigate('/signup')}>
                      Sign Up
                    </MenuItem>}
                  {localStorage.token &&
                    <MenuItem
                      onClick={() => {
                        localStorage.clear()
                        navigate('/')
                        this.props.renderAgain()
                      }}
                    >
                      LogOut
                    </MenuItem>}
                </Menu>
              </div>}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(MenuAppBar)
