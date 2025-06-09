const db = require("./models");

// Silence all console output BEFORE sync
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
console.info = jest.fn();

beforeAll(async () => {
   await db.sequelize.sync({ force: true });
});