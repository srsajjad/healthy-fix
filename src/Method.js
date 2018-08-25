import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Recipe from './Recipe'
import './AllMeals.css'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

function Method (props) {
  const { classes, mealName, allRecipes } = props
  let mealKey = mealName[0].toLowerCase()
  let finalRecipeArr = allRecipes.filter(n => n.recipeKey[0] === mealKey)
  console.log('finalRecipeArr', finalRecipeArr)

  return (
    <div className='paper-parent'>
      <div>
        {finalRecipeArr.map((n, i) => {
          return (
            <div>
              <Paper key={i} className={classes.root + ' paper'} elevation={1}>
                <Typography paragraph variant='body2'>
                  Recipe {n.recipeKey}:
                </Typography>
                <pre>

                  {n.recipeText}

                </pre>
                <br />
                <Recipe />
              </Paper><br /><br />
            </div>
          )
        })}

      </div>

    </div>
  )
}

export default withStyles(styles)(Method)
