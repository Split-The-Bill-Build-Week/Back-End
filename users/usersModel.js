const knex = require('knex')
const config = require('../knexfile.js')

const environment = process.env.DB_ENV || 'development'

const db = knex(config[environment])

module.exports = {
    get,
    getBy,
    getById,
    insert,
    update,
    remove,
    getMeal,
    getMealById,
    getUserMealById,
    insertMeal,
    updateMeal,
    removeMeal
}

function get() {
    return db('users')
}

function getBy(filter) {
    return db('users').where(filter)
  }

function getById(id) {
    return db('users')
        .where({ id })
        // .first()
}
function insert(user) {
    return db('users')
        .insert(user, 'id')
        .then(ids => {
        const [id] = ids
        return getById(id)
        })
}

function update(id, changes) {
    return db('users')
      .where({ id })
      .update(changes)
  }
  
function remove(id) {
    return db('users')
        .where('id', id)
        .del();
}

// ******MEALS abstract this if time******

function getMealById(id) {
    return db('meals')
        .where({ id })
        .first()
}

function getMeal(id) {
    return db('user_meals')
        // .select('*')
        // .join('users', 'user_meals.user_id', 'users.id')
        // .select('user_meals.meal_id')
        // .where('users.id', id)
        .join('meals', 'meals.id', "user_meals.meal_id")
        .where('user_meals.user_id', id) 
        .select('meals.*')
        // .where('users.id', "user_meals.user_id")       
}

function getUserMealById(id, ids) {
    return db('user_meals')
        // .join('users', 'user_meals.user_id', 'users.id')
        .join('meals', 'meals.id', "user_meals.meal_id")
        .where('user_meals.user_id', id)  
        .where('meals.id', ids)
        .first()
        .select('meals.*')
}
// ***********************************************************
// Needs CLEAN UP*/
function insertMeal(id, changes) {
    return db('meals')
    .insert(changes)
    .then( ids => {
        // console.log(id)
        return getMealById(ids[0])
    })
    .then( meal => {
        // console.log(meal)
        const body = {user_id: id, meal_id: meal.id}
        return db('user_meals')
        .insert(body)
    })
    .then( id , (req, res)=> {
        res.status(200).json(meal)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'oops server did not function'})
    })
}
//NW - havent started
function updateMeal(id, changes) {
    return db('meals')
      .where({ id })
      .update(changes)
}

function removeMeal(id, ids) {
    return db('user_meals')
        // .join('users', 'user_meals.user_id', 'users.id')
        .join('meals', "user_meals.meal_id", 'meals.id')
        .where('user_meals.meal_id', ids)  
        .andWhere('user_meals.user_id', id)
        .first()
        // .select('meals.*')
        .del()
}


