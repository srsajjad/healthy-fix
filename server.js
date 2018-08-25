let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let fs = require('fs')
let cors = require('cors')
let r = require('rethinkdb')
var jwt = require('jsonwebtoken')
require('dotenv').config()

// middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let conn = null

r.connect({ host: 'localhost', port: 28015 }, async function (err, conn) {
  if (err) throw err
  conn = conn

  // r.dbList().run(conn, async(err, cursor)=>{
  //   if (err) throw err
  //   console.log('whats this', cursor)
  //   console.log('tyoe', typeof cursor)
  // })

  let dbList = await r.dbList().run(conn)
  console.log('dbList', dbList)

  if (!dbList.includes('foodplan')) {
    let created = await r.dbCreate('foodplan').run(conn)
    console.log('created', created)
  }

  let tableList = await r.db('foodplan').tableList().run(conn)
  console.log('table list', tableList)
  ;[('meals', 'recipe', 'users', 'tokenList')].forEach(async n => {
    if (!tableList.includes(n)) {
      let createdTable = await r.db('foodplan').tableCreate(n).run(conn)
      console.log('created table', createdTable)
    }
  })

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
    // console.log('login flow was hit')
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
    // console.log('name', name)
    // console.log('password', password)
    // console.log('token', token)

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
        // console.log('result', result[0])
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
    // console.log('name', name)

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
              .run(conn, (err, cursor) => {
                if (err) throw err
                // console.log('after updating result')
                let token = jwt.sign({ name, password }, process.env.SECRET_KEY)
                res.json({
                  status: 'success',
                  message: 'updated successfully',
                  token: token
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

    // console.log('name', name)
    // console.log('meal', meal)
    // console.log('token', token)

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
            .run(conn, (err, cursor) => {
              if (err) throw err
              res.json({
                status: 'success',
                message: 'subscribed to mealplan successfully'
              })
            })
        } else {
          res.json({
            status: 'failed',
            message: 'Could Not Subscribe'
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
            .run(conn, (err, cursor) => {
              if (err) throw err
              res.json({
                status: 'success',
                message: 'unsubscribed to mealplan successfully'
              })
            })
        } else {
          res.json({
            status: 'failed',
            message: 'Could Not Unsubscribe'
          })
        }
      })
  })

  // all meal plans
  app.get('/mealplan/meals', (req, res) => {
    r.db('foodplan').table('meals').run(conn, async (err, cursor) => {
      if (err) throw err
      let result = await cursor.toArray()
      if (result[0]) {
        res.json({
          status: 'success',
          meals: result.map(n => n)
        })
      } else {
        r
          .db('foodplan')
          .table('meals')
          .insert([
            {
              meal: 'Dairy Free',
              recipes: ['d1', 'd2', 'd3']
            },
            {
              meal: 'Ketogenic',
              recipes: ['k1', 'k2', 'k3']
            },
            {
              meal: 'Vegan',
              recipes: ['v1', 'v2', 'v3']
            },
            {
              meal: 'Paleo',
              recipes: ['p1', 'p2', 'p3']
            },
            {
              meal: 'Moderate Low Carb',
              recipes: ['m1', 'm2', 'm3']
            },
            {
              meal: 'Intermittent Fasting',
              recipes: ['i1', 'i2', 'i3']
            }
          ])
          .run(conn, (err, cursor) => {
            if (err) throw err
            r.db('foodplan').table('meals').run(conn, async (err, cursor) => {
              if (err) throw err
              let result = await cursor.toArray()
              if (result[0]) {
                res.json({
                  status: 'success',
                  meals: result.map(n => n)
                })
              } else {
                res.json({
                  status: 'failed',
                  message: 'data not found'
                })
              }
            })
          })
      }
    })
  })

  // meal plan recipes
  app.get('/mealplan/recipe/:meal', (req, res) => {
    let meal = req.params.meal
    // console.log('meal', meal)
    r
      .db('foodplan')
      .table('meals')
      .filter({ meal })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        // console.log('result', result)
        if (result[0]) {
          let recipes = result[0].recipes
          res.json({
            status: 'success',
            recipes
          })
        } else {
          res.json({ status: 'failed', message: 'data not found' })
        }
      })
  })

  // get recipe by recipeKey
  app.get('/recipe/:recipeKey', (req, res) => {
    let recipeKey = req.params.recipeKey
    // console.log('recipe key', recipeKey)
    r
      .db('foodplan')
      .table('recipe')
      .filter({ recipeKey })
      .run(conn, async (err, cursor) => {
        if (err) throw err
        let result = await cursor.toArray()
        // console.log('result', result)
        if (result[0]) {
          let recipeText = result[0].recipeText
          res.json({
            status: 'success',
            recipeText
          })
        } else {
          res.json({
            status: 'failed',
            message: 'Recipe Not Found. Add Recipe !'
          })
        }
      })
  })

  // add recipe for speicific meal
  app.post('/mealplan/recipe', (req, res) => {
    let { secretKey, mealName, recipeKey, recipeText } = req.body

    if (secretKey === 'foodie123') {
      r
        .db('foodplan')
        .table('meals')
        .filter({ meal: mealName })
        .run(conn, async (err, cursor) => {
          if (err) throw err
          let result = await cursor.toArray()
          // console.log('result', result)
          if (result[0]) {
            let whichMeal = result[0]
            if (whichMeal) {
              // let whichRecipeKey = whichMeal.recipeKey
              let recipeArr = whichMeal.recipes
              // console.log('recipeArr', recipeArr)

              if (!recipeArr.includes(recipeKey)) {
                // append a new recipeKey to the meals table recipe array

                console.log('i am inside')
                let newRecipeKey =
                  whichMeal.meal[0].toLowerCase() + (recipeArr.length + 1)

                console.log('new recipe key', newRecipeKey)

                r
                  .db('foodplan')
                  .table('meals')
                  .get(whichMeal.id)
                  .update({
                    recipes: Array.from(new Set([...recipeArr, newRecipeKey]))
                  })
                  .run(conn, (err, cursor) => {
                    if (err) throw err
                    // insert recipe into database
                    r
                      .db('foodplan')
                      .table('recipe')
                      .insert({ recipeKey: newRecipeKey, recipeText })
                      .run(conn, (err, cursor) => {
                        if (err) throw err
                        res.json({
                          status: 'success',
                          message: 'Added New Recipe Key And Recipe Successfully !'
                        })
                      })
                  })
              } else {
                // update recipe inside database
                r
                  .db('foodplan')
                  .table('recipe')
                  .filter({ recipeKey })
                  .run(conn, async (err, cursor) => {
                    if (err) throw err
                    let resultIn = await cursor.toArray()
                    // console.log('resujltIn', resultIn)
                    if (resultIn[0]) {
                      r
                        .db('foodplan')
                        .table('recipe')
                        .filter({ recipeKey })
                        .update({ recipeText })
                        .run(conn, (err, cursor) => {
                          if (err) throw err
                          res.json({
                            status: 'success',
                            message: 'Updated Recipe Successfully !'
                          })
                        })
                    } else {
                      // insert
                      r
                        .db('foodplan')
                        .table('recipe')
                        .insert({ recipeKey, recipeText })
                        .run(conn, (err, cursor) => {
                          if (err) throw err
                          res.json({
                            status: 'success',
                            message: 'Added Recipe Successfully !'
                          })
                        })
                    }
                  })
              }
            }
          }
        })
    } else {
      res.json({ status: 'falseKey', message: 'Wrong Admin Key' })
    }
  })

  // get all recipes
  app.get('/recipe', (req, res) => {
    r.db('foodplan').table('recipe').run(conn, async (err, cursor) => {
      if (err) throw err
      let result = await cursor.toArray()
      // console.log('result', result)
      if (result[0]) {
        res.json({ status: 'success', allRecipes: result })
      } else {
        res.json({ status: 'failed', message: 'not found' })
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
