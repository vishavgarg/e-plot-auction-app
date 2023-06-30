'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paymentdetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.winningbids);
    }
  }
  Paymentdetails.init({
    name: DataTypes.STRING,
    cardDetails: DataTypes.INTEGER,
    paidAmount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'paymentdetails',
  });
  return Paymentdetails;
};