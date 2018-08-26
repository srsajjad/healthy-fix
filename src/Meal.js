import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import red from '@material-ui/core/colors/red'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Subscribe from './Subscribe'
import './AllMeals.css'

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  }
})

class Meal extends React.Component {
  state = { expanded: false }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render () {
    const { classes, meal, navigate } = this.props
    // console.dir(this.props)
    return (
      <div className='card-listy'>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label='Recipe' className={classes.avatar}>
                R
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon
                  onClick={() => {
                    // console.log('i was clicked')
                    navigate(`/method/${meal.meal}`)
                  }}
                />
              </IconButton>
            }
            title={meal.meal}
          />
          <img style={{ height: '200px' }} src={this.props.imgName} />
          <CardContent>
            <Typography component='p'>
              This impressive paella is a perfect party dish and a fun meal to cook together with
              your guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </Typography>
          </CardContent>
          <CardActions
            className={classes.actions}
            disableActionSpacing
          >
            <Subscribe
              mealName={meal.meal}
              userMeals={this.props.userMeals}
              renderAgain={userInfo => this.props.renderAgain(userInfo)}
            />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(Meal)
