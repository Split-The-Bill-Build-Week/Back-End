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
        .join('meals', 'meals.id', "user_meals.meal_id")
        .where('user_meals.user_id', id) 
        .select('meals.*')
   
}

function getUserMealById(id, ids) {
    return db('user_meals')
        // .join('users', 'user_meals.user_id', 'users.id')
        .join('meals', 'meals.id', "user_meals.meal_id")
        .where('user_meals.user_id', id)  
        .where('meals.id', ids)
        .first()
        .select('*')
}

// ***********************************************************
// Needs CLEAN UP*/
async function insertMeal(id, changes) {
    const meal = await db('meals').insert(changes, ['id'])
    const mealId = meal[0].id;

    await db('user_meals').insert({'user_id': id, 'meal_id': mealId})
    return getMealById(meal[0].id)
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

// // Alternative helper function for getMealById(id)
// function getMealsByUserId(id) {
//   return db('user_meals AS um')
//     .select(['um.user_id', 'um.meal_id', 'm.id', 'm.restaurant', 'm.meal', 'm.total', 'm.comments'])
//     .join('meals AS m', 'um.meal_id', 'm.id')
//     .where({ user_id: id })
// };

// // Alternative helper function for getById(id)
// function getByIdWithMeals(id) {
//   const userQuery = get().where({ id }).first();
//   const mealsQuery = getMealsByUserId(id);
  
//   return Promise.all([userQuery, mealsQuery])
//     .then(([user, meals]) => {
//       user.meals = meals;
//       return user;
//     });
// };


