const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");


const workModel = sequelize.define("work", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
});



module.exports = {
  list: async function () {
    const work = await workModel.findAll();
    return work;
  },
  save: async function (title, description, year, categorie, ageGroup, time) {
    const work = await workModel.create({
      title: title,
      description: description,
      year: year,
      categorie: categorie,
      ageGroup: ageGroup,
      time: time
    });
    return work;
  },
  update: async (id, title, description, year, categorie, ageGroup, time) => {
    const work = await workModel.findByPk(id);
    if (!work) {
      return false;
    }
    await work.update({
      title: title,
      description: description,
      year: year,
      categorie: categorie,
      ageGroup: ageGroup,
      time: time
    });

    return work;
  },

  delete: async function (id) {
    return await workModel.destroy({ where: { id: id } });
  },

  getById: async function (id) {
    return await workModel.findByPk(id);
  },

  checkAge: async function (title, age) {
    const work = await workModel.findOne({ where: { title: title } });
    if (!work) {
      return false; // Returns false if the work is not found
    }
  
    const isAgeValid = age >= work.ageGroup;
    return isAgeValid;
  },

  Model: workModel    
 
};
