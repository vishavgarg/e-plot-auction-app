"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Winners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.plot);
    }
  }
  Winners.init(
    {
      bidAmount: DataTypes.INTEGER,
      isPaid: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "winningbids",
    }
  );
  return Winners;
};
