let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let fs = require('fs')
let cors = require('cors')
let r = require('rethinkdb')
var jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

let connection = null
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err
  connection = conn
})

// sign up
app.post('/auth/signup', (req, res) => {
  let { name, password, age, loa } = req.body

  r
    .table('users')
    .filter({
      user: user
    })
    .run(conn, async (err, result) => {
      if (err) throw err
      if (result) {
        res.json({
          status: 'failed',
          message: 'this user name is already taken'
        })
      } else {
        let response = await r
          .table('users')
          .insert({ name, password, age, loa, meals: [] })
          .run(connection)

        console.log('sign up response', response)

        let token = jwt.sign({ name, password }, process.env.SECRET_KEY)
        res.json({
          status: 'success',
          message: 'successfully created user',
          token
        })
      }
    })
})

// log in
app.post('/auth/login', (req, res) => {
  let { token } = req.body
  let decoded = jwt.verify(token, process.env.SECRET_KEY)
  let { name, password } = decoded
  r
    .table('users')
    .filter({
      user: name,
      password: password
    })
    .run(conn, (err, result) => {
      if (err) throw err
      if (result) {
        res.json({ status: 'success', message: 'successfully logged in' })
      } else {
        res.json({ status: 'failed', message: 'wrong credentials' })
      }
    })
})

// profile
app.get('/profile/:name', (req, res) => {
  let { name } = req.params
  r
    .table('users')
    .filter({
      user: name
    })
    .run(conn, (err, result) => {
      if (err) throw err
      if (result) {
        res.json({ status: 'success', userInfo: result })
      } else {
        res.json({ status: 'failed', message: 'not found' })
      }
    })
})

// profile update
app.post('/me/update', (req, res) => {
  let { name, password, age, loa } = req.body

  r
    .table('users')
    .filter({
      user: name
    })
    .run(conn, async (err, result) => {
      if (err) throw err
      if (result) {
        console.log('result', result)
        r
          .table('users')
          .get(result.id)
          .update({ name, password, age, loa })
          .run(conn, (err, result) => {
            if (err) throw err
            res.json({
              status: 'success',
              message: 'updated successfully'
            })
          })
      }
    })
})

// subscribe to meal plan
app.post('/mealplan/subscribe', (req, res) => {
  let { mealId, meal, name } = req.body
  r
    .table('users')
    .filter({
      user: name
    })
    .run(conn, async (err, result) => {
      if (err) throw err
      if (result) {
        console.log('result', result)
        r
          .table('users')
          .get(result.id)
          .update({ meals: [...result.meals, { mealId, meal }] })
          .run(conn, (err, result) => {
            if (err) throw err
            res.json({
              status: 'success',
              message: 'subscribed to mealplan successfully'
            })
          })
      }
    })
})

// unsubscribe  meal plans
app.post('/mealplan/unsubscribe', (req, res) => {
  let { mealId, name } = req.body
  r
    .table('users')
    .filter({
      user: name
    })
    .run(conn, async (err, result) => {
      if (err) throw err
      if (result) {
        console.log('result', result)
        r
          .table('users')
          .get(result.id)
          .update({ meals: result.meals.filter(n => n.mealId !== mealId) })
          .run(conn, (err, result) => {
            if (err) throw err
            res.json({
              status: 'success',
              message: 'unsubscribed to mealplan successfully'
            })
          })
      }
    })
})

// meal plan recipes
app.get('/mealplan/recipe/:mealId', (req, res) => {
  let mealId = req.params.mealId
  r.table('meals').run(conn, (err, result) => {
    if (err) throw err
    if (result) {
      let obj = result.meals.filter(n => n.mealId === mealId)
      let recipe = obj.recipes
      res.json({
        status: 'success',
        recipe
      })
    } else {
      res.json({ status: 'failed', message: 'data not found' })
    }
  })
})

// meal plan categories
app.get('/mealplan/categories', (req, res) => {
  r.table('meals').run(conn, (err, result) => {
    if (err) throw err
    if (result) {
      res.json({
        status: 'success',
        meals: result.meals.map(n => {
          n.mealId, n.meal
        })
      })
    } else {
      res.json({ status: 'failed', message: 'data not found' })
    }
  })
})

app.listen(1337, () => console.log('listening to the port 1337'))

// notes
// get requests don't have req.body

// meals = [
//   {
//     mealId: 1,
//     meal: 'Intermittent Fasting',
//     recipes: [
//       {
//         rName: 'water',
//         ingredients: ['water', 'glass']
//       },
//       {
//         rName: 'cigarette',
//         ingredients: ['nicotine', 'paper']
//       },
//       {
//         rName: 'tea',
//         ingredients: ['water', 'tea', 'milk']
//       }
//     ]
//   },
//   {
//     mealId: 2,
//     meal: 'Just Juice',
//     recipes: [
//       {
//         rName: 'mango juice',
//         ingredients: ['water', 'mango']
//       },
//       {
//         rName: 'lassi',
//         ingredients: ['cart', 'sirup']
//       },
//       {
//         rName: 'beer',
//         ingredients: ['water', 'alchohol']
//       }
//     ]
//   }
// ]
