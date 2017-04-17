'use strict';

const GeneratePasswordFunction = () => {
  let stra = Math.random().toString(36).slice(-10);
  let strb = Math.random().toString(36).slice(-10);
  let concat = String(stra + strb).replace(/\./g,'a');
  return concat.split('').sort(function () {
    return 0.5 - Math.random();
  }).join('');
};

const NullDate = new Date(Date.parse('1970-01-01T00:00:00+0000'));

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: GeneratePasswordFunction(),
        password: `${GeneratePasswordFunction()}${GeneratePasswordFunction()}`,
        createdAt: NullDate,
        updatedAt: NullDate
      }
    ], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
