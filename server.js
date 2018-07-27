let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let fs = require('fs')
let cors = require('cors')
let r = require('rethinkdb')
var jwt = require('jsonwebtoken')
require('dotenv').config()

// app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let conn = null
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err
  conn = conn

  // sign up
  app.post('/auth/signup', (req, res) => {
    let { name, password, age, loa } = req.body
    r
      .db('foodplan')
      .table('users')
      .filter({
        name: name
      })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        if (result[0] && result[0].name === name) {
          res.json({
            status: 'failed',
            message: 'this user name is already taken'
          })
        } else {
          let response = await r
            .db('foodplan')
            .table('users')
            .insert({ name, password, age, loa, meals: [] })
            .run(conn)

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
    let token, name, password
    req.get('Authorization')
      ? (token = req.get('Authorization').split(' ')[1])
      : null
    if (!token) {
      name = req.body.name
      password = req.body.password
      token = jwt.sign({ name, password }, process.env.SECRET_KEY)
    } else {
      let decoded = jwt.verify(token, process.env.SECRET_KEY)
      name = decoded.name
      password = decoded.password
    }

    r
      .db('foodplan')
      .table('users')
      .filter({
        name: name,
        password: password
      })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        if (result[0] && result[0].name && result[0].password) {
          res.json({
            status: 'success',
            message: 'successfully logged in',
            token
          })
        } else {
          if (req.body.name && req.body.password) {
            r
              .db('foodplan')
              .table('users')
              .filter({
                user: req.body.name,
                password: req.body.password
              })
              .run(conn, async (err, cursor) => {
                if (err) throw err
                let result = await cursor.toArray()
                if (result[0] && result[0].name && result[0].password) {
                  let token = jwt.sign(
                    { name: result[0].name, password: result[0].password },
                    process.env.SECRET_KEY
                  )
                  res.json({
                    status: 'success',
                    message: 'successfully logged in',
                    token
                  })
                } else {
                  res.json({ status: 'failed', message: 'wrong credentials' })
                }
              })
          } else {
            res.json({ status: 'failed', message: 'wrong credentials' })
          }
        }
      })
  })

  // profile
  app.get('/profile', (req, res) => {
    let token, name
    req.get('Authorization')
      ? (token = req.get('Authorization').split(' ')[1])
      : null

    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    name = decoded.name
    console.log('name', name)

    r
      .db('foodplan')
      .table('users')
      .filter({
        name: name
      })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        // console.log('result', result)
        if (result[0]) {
          res.json({ status: 'success', userInfo: result[0] })
        } else {
          res.json({ status: 'failed', message: 'not found' })
        }
      })
  })

  // profile update
  app.post('/me/update', (req, res) => {
    let token
    let { name, password, age, loa } = req.body

    req.get('Authorization')
      ? (token = req.get('Authorization').split(' ')[1])
      : null

    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    let prevName = decoded.name

    if (prevName !== name) {
      r
        .db('foodplan')
        .table('users')
        .filter({
          name: name
        })
        .run(conn, async (err, cursor) => {
          if (err) throw err
          let result = await cursor.toArray()
          if (result[0] && result[0].name === name) {
            res.json({
              status: 'failed',
              message: 'this user name is already taken'
            })
          } else {
            updateDB()
          }
        })
    } else {
      updateDB()
    }

    function updateDB () {
      r
        .db('foodplan')
        .table('users')
        .filter({
          name: prevName
        })
        .run(conn, async (err, cursor) => {
          if (err) throw err
          let result = await cursor.toArray()
          if (result[0]) {
            let id = result[0].id
            r
              .db('foodplan')
              .table('users')
              .get(id)
              .update({ name, password, age, loa })
              .run(conn, (err, result) => {
                if (err) throw err
                console.log('after updating result')
                res.json({
                  status: 'success',
                  message: 'updated successfully'
                })
              })
          }
        })
    }
  })

  // subscribe to meal plan
  app.post('/mealplan/subscribe', (req, res) => {
    let token
    let { meal } = req.body

    req.get('Authorization')
      ? (token = req.get('Authorization').split(' ')[1])
      : null

    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    let name = decoded.name

    r
      .db('foodplan')
      .table('users')
      .filter({
        name: name
      })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        if (result[0]) {
          r
            .db('foodplan')
            .table('users')
            .get(result[0].id)
            .update({ meals: Array.from(new Set([...result[0].meals, meal])) })
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
    let token
    let { meal } = req.body

    req.get('Authorization')
      ? (token = req.get('Authorization').split(' ')[1])
      : null

    let decoded = jwt.verify(token, process.env.SECRET_KEY)
    let name = decoded.name

    r
      .db('foodplan')
      .table('users')
      .filter({
        name: name
      })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        if (result[0]) {
          r
            .db('foodplan')
            .table('users')
            .get(result[0].id)
            .update({
              meals: Array.from(
                new Set(result[0].meals.filter(n => n !== meal))
              )
            })
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
  app.get('/mealplan/recipe/:meal', (req, res) => {
    let meal = req.params.meal
    console.log(meal)
    r.db('foodplan').table('meals').run(conn, async (err, cursor) => {
      if (err) throw err
      let result = await cursor.toArray()
      console.log('result', result)
      if (result[0]) {
        let fltr = result.filter(n => n.meal === meal)
        console.log(fltr)
        let recipe = fltr[0].recipes
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
  app.get('/mealplan/meals', (req, res) => {
    r.db('foodplan').table('meals').run(conn, async (err, cursor) => {
      if (err) throw err
      let result = await cursor.toArray()
      if (result[0]) {
        res.json({
          status: 'success',
          meals: result.map(n => n.meal)
        })
      } else {
        res.json({ status: 'failed', message: 'data not found' })
      }
    })
  })
})

app.listen(1337, () => console.log('listening to the port 1337'))

// [
//   {
//     meal: 'Intermittent Fasting',
//     recipe:  'Dont eat anything till the noon'
//   },
//   {
//     meal: 'Just Juice',
//     recipes: 'Drink juice only'
//   }
// ]
