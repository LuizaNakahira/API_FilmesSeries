const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/db");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { fail, success } = require("../helpers/resposta");

const UserModel = require("../model/user");
const reviewModel = require("../model/review");
const workModel = require("../model/work");

router.get("/", async (req, res) => {
  //Sincroniza o banco de dados
  await sequelize.sync({ force: true });

  let users = [
    { login: "admin", password: "admin", isAdmin: true },
    { login: "user1", password: "password2", isAdmin: false },
    { login: "user2", password: "password2", isAdmin: false },
    { login: "user3", password: "password3", isAdmin: false },
    { login: "user4", password: "password4", isAdmin: false },
    { login: "user5", password: "password5", isAdmin: false },
    { login: "user6", password: "password6", isAdmin: false },
  ];

  let reviews = [
    {
      text: " A trama gira em torno de Katniss Everdeen, uma jovem que se voluntaria para participar dos Jogos Vorazes, um evento brutal onde jovens de diferentes distritos competem pela sobrevivência",
      note: "8",
      cineWork: "Jogos Vorazes",
      author: "Suzane Collins",
    },
    {
      text: "A narrativa aborda sua descoberta do mundo mágico, sua educação em Hogwarts, e sua luta contra o malévolo bruxo Lord Voldemort",
      note: "9",
      cineWork: "Harry Potter",
      author: "J.K Rowlling",
    },
    {
      text: "A comédia destaca situações cômicas, desafios profissionais e romances ao longo de suas dez temporadas",
      note: "9",
      cineWork: "Friends",
      author: "Marta kauffman",
    },
    {
      text: "A série explora amizades, relacionamentos e os altos e baixos da vida adulta",
      note: "8",
      cineWork: "HIMYM",
      author: "Craig Thomas",
    },
    {
      text: "Baseado nas tradições hindus, o movimento promove a devoção a Krishna por meio de práticas espirituais, canto de mantras e distribuição de literatura sagrada",
      note: "7",
      cineWork: "Hare Krishna",
      author: "Bhaktivedanta Swami Prabhupada",
    },
    {
      text: "O filme destaca questões sociais, ambientais e a transformação do lixo em arte",
      note: "9",
      cineWork: "Lixo Extraordinário",
      author: "João Jardim,",
    },
    {
      text: "Com elementos de mitologia polinésia, o filme aborda temas de coragem, autodescoberta e preservação ambiental.",
      note: "6",
      cineWork: "Moana",
      author: "Disney",
    },
  ];

  let works = [
    {
      title: "Diario de um Banana",
      description: "Baseado em um livro",
      year: "2010",
      categorie: "Comedia",
      ageGroup: "10",
      time: "1h40",
    },
    {
      title: "Star Wars",
      description: "Darth Vader vs Luck",
      year: "1998",
      categorie: "Ficcao Cientifica",
      ageGroup: "12",
      time: "2h40",
    },
    {
      title: "O crinch",
      description: "Roubando presentes",
      year: "2000",
      categorie: "Comedia",
      ageGroup: "10",
      time: "2h40",
    },
    {
      title: "Nootebook",
      description: "Casal intenso",
      year: "2005",
      categorie: "Romance",
      ageGroup: "14",
      time: "2h40",
    },
    {
      title: "Outlander",
      description: "Viagem no tempo",
      year: "2022",
      categorie: "Romance",
      ageGroup: "16",
      time: "8 eps",
    },
    {
      title: "Cliford",
      description: "Super cão",
      year: "2022",
      categorie: "Aventura",
      ageGroup: "10",
      time: "1h30",
    },
  ];

  try {
    let createdUsers = [];
    for (let i = 0; i < users.length; i++) {
      let { login, password, isAdmin } = users[i];
      let createdUser = await UserModel.save(login, password, isAdmin);
      createdUsers.push(createdUser);
    }

    let createdReviews = [];
    for (let i = 0; i < reviews.length; i++) {
      let { text, note, cineWork, author } = reviews[i];
      let createdReview = await reviewModel.save(text, note, cineWork, author);
      createdReviews.push(createdReview);
    }

    let createdWorks = [];
    for (let i = 0; i < works.length; i++) {
      let { title, description, year, categorie, ageGroup, time } = works[i];
      let createdWork = await workModel.save(
        title,
        description,
        year,
        categorie,
        ageGroup,
        time
      );
      createdWorks.push(createdWork);
    }

    res.json({
      users: createdUsers,
      reviews: createdReviews,
      works: createdWorks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o install" });
  }
});

module.exports = router;
