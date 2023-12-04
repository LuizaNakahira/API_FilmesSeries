const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/db');

const userModel = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
    }
});

module.exports = {
    list: async function () {
        const users = await userModel.findAll();
        return users;
    },

    save: async function (login, password, isAdmin) {
        const user = await userModel.create({
            login: login,
            password: password,
            isAdmin: isAdmin,
        });
        return user;
    },

    update: async (id, login, password, isAdmin, contador) => {
        const user = await userModel.findByPk(id);
        if (!user) {
            return false;
        }

        await user.update({
            login: login,
            password: password,
            isAdmin: isAdmin,
            contador: contador
        });

        return user;
    },

    delete: async function (id) {
        return await userModel.destroy({ where: { id: id } });
    },

    getById: async function (id) {
        return await userModel.findByPk(id);
    },

    getByLogin: async function (login) {
        return await userModel.findOne({ where: { login: login } });
    },

    Model: userModel
};