const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const reviewMod = require("../model/review");
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
      console.log('Token verification error:', err);
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
    const review = await reviewMod.list();

    const reviewsPag = review.slice(startIndex, endIndex);

    res.json(success(reviewsPag, "Listando..."));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro: Listar criticas"));
  }
});

router.get("/:id",  async (req, res) => {
  let reviews = await reviewMod.getById(req.params.id);
  if (reviews) {
    res.json(success(reviews));
  } else {
    res.status(500).json(fail("Não foi possível localizar a critica..."));
  }
});

router.post("/", validaToken, async (req, res) => {
  const { text, note, cineWork, author } = req.body;

  try {
    let reviews = await reviewMod.save(text, note, cineWork, author);

    res.json(success(reviews));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar crítica"));
  }
});

router.put("/:id", validaToken, async (req, res) => {
  const { id } = req.params;
  const { text, note, cineWork, author } = req.body;

  let atualizacao = await reviewMod.update(id, text, note, cineWork, author);
  if (atualizacao) {
    res.json(success(atualizacao));
  } else {
    res.status(500).json(fail("Falha ao alterar critica"));
  }
});

router.delete("/:id", /*validaToken,*/async (req, res) => {
  let atualizacao = await reviewMod.delete(req.params.id);
  if (atualizacao) {
    res.json(success(atualizacao));
  } else {
    res.status(500).json(fail("Critica nao existe"));
  }
});

module.exports = router;
