const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

const lookingForModel = sequelize.define("lookingFor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ageGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expectation: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = {
  list: async function () {
    const lookingFors = await lookingForModel.findAll();
    return lookingFors;
  },
  save: async function ( categorie, ageGroup, time, expectation) {
    const lookingFor = await lookingForModel.create({
      categorie: categorie,
      ageGroup: ageGroup,
      time: time,
      expectation: expectation,
    });
    return lookingFor;
  },
  update: async ( id, categorie, ageGroup, time, expectation) => {
    const lookingFor = await lookingForModel.findByPk(id);
    if (!lookingFor) {
      return false;
    }
    await lookingFor.update({
      categorie: categorie,
      ageGroup: ageGroup,
      time: time,
      expectation: expectation,
    });

    return lookingFor;
  },

  delete: async function (id) {
    return await lookingForModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await lookingForModel.findByPk(id);
  },

  Model: lookingForModel,
};
