const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const workMod = require("../model/work");
const { success, fail } = require("../helpers/resposta");
require("dotenv").config();

//Verificar o Token
function validaToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json(fail("Token de autenticação não fornecido"));
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(401).json(fail("Token de autenticação inválido"));
    }

    req.user = decoded;
    next();
  });
}

router.get("/", validaToken, async (req, res) => {
  const limite = parseInt(req.query.limite);
  const pagina = parseInt(req.query.pagina);

  const startIndex = (pagina - 1) * limite;
  const endIndex = pagina * limite;

  try {
    const works = await workMod.list();

    const workPag = works.slice(startIndex, endIndex);

    res.json(success(workPag, "Listando..."));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro: Listar obras"));
  }
});

router.get("/:id", validaToken, async (req, res) => {
  let work = await workMod.getById(req.params.id);
  if (work) {
    res.json(success(work));
  } else {
    res.status(500).json(fail("Não foi possível localizar a obra!"));
  }
});

router.post("/", validaToken, async (req, res) => {
  const { title, description, year, categorie, ageGroup, time } = req.body;

  try {
    let works = await workMod.save(title, description, year, categorie, ageGroup, time);

    res.json(success(works));
    
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar a nova obra!"));
  }
});

router.put("/:id", validaToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, year, categorie,  ageGroup, time } = req.body;

  let result = await workMod.update(id, title, description, year, categorie,  ageGroup, time);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Falha ao alterar a obra!"));
  }
});

router.delete("/:id", validaToken, async (req, res) => {
  let result = await workMod.delete(req.params.id);
  if (result) {
    res.json(success(result));
  } else {
    res.status(500).json(fail("Obra não encontrada!"));
  }
});

router.get("/checkAge/:title/:age", validaToken, async (req, res) => {
  const { title, age } = req.params;

  try {
    const isAgeValid = await workMod.checkAge(title, parseInt(age));
    if (isAgeValid) {
      res.json(success({ isValid: true, message: "Você pode ver este filme!" }));
    } else {
      res.json(success({ isValid: false, message: "Não recomendado você ver este filme. Você é muito novo!" }));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao verificar a idade!"));
  }
});


module.exports = router;
