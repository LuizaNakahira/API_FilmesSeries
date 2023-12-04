const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/db');

const reviewModel = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    note: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cineWork: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = {
    list: async function () {
        const reviews = await reviewModel.findAll();
        return reviews;
      },
      save: async function (text, note, cineWork, author) {
        const review = await reviewModel.create({
          text: text,
          note: note,
          cineWork: cineWork,
          author: author,
        });
        return review;
      },
      update: async (id, text, note, cineWork, author) => {
        const review = await reviewModel.findByPk(id);
        if (!review) {
          return false;
        }
        await review.update({
          text: text,
          note: note,
          cineWork: cineWork,
          author: author,
        });
    
        return review;
      },
    
      delete: async function (id) {
        return await reviewModel.destroy({ where: { id: id } });
      },
    
      getById: async function (id) {
        return await reviewModel.findByPk(id);
      },
    
      Model: reviewModel    
};