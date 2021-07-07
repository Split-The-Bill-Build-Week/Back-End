const Meals = require('./mealsModel.js');
const db = require('../data/dbConfig.js');

describe('meals model', () => {
  beforeEach(async () => {
    await db('meals').truncate();
  })

  it('should set envrionment to testing', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });
})