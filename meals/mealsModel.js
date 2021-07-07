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
    getUsersForMeal,
    findById,
    insertUserToMeal
}

function get() {
    return db('meals')
}

function getBy(filter) {
    return db('meals')
        .where(filter)
  }

function getById(id) {
    return db('meals')
        .where({ id })
        .first()
}
function insert(user) {
    return db('meals')
        .insert(user, 'id')
        .then(ids => {
        const [id] = ids
        return getById(id)
        })
}

function update(id, changes) {
    return db('meals')
      .where({ id })
      .update(changes)
  }
  
  function remove(id) {
    return db('meals')
      .where('id', id)
      .del();
  }
function getMeal(id) {
    return db('users')
        .join('user_meals', 'users.id', 'user_meals.user_id')
        // .select('user_meals.meal_id')
        .where('users.id', id)
        .join('meals', 'meals.id', "user_meals.meal_id")   
        .select('meals.*')
        // .where('users.id', id)
}

function getMealById(id) {
    return db('meals as m')
        .where({id})
};

function getUsersForMeal(id) {
    return db('user_meals as um')
      .select(['um.meal_id', 'um.paid', 'u.firstName', 'u.lastName', 'u.username', 'm.restaurant', 'm.meal', 'm.total', 'm.comments'])
      .join('users as u', 'u.id', 'um.user_id')
      .join('meals as m', 'm.id', 'um.meal_id')
      .where('um.meal_id', id)
  };

  // Alternate to getMealById for meals router
  function findById(id) {
      return db('meals')
        .where({id})
  };

  function insertUserToMeal(users) {
    return db('user_meals as um')
        .insert(users)
  };