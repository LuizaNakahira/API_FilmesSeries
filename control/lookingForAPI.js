const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const lookingForMod = require("../model/lookingFor");
const { success, fail } = require("../helpers/resposta");
const lookingFor = require("../model/lookingFor");
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
    const lookingFor = await lookingForMod.list();

    const lookingForPag = lookingFor.slice(startIndex, endIndex);

    res.json(success(lookingForPag, "Listando..."));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro: Listar criticas"));
  }
});

router.get("/:id",  async (req, res) => {
  let lookingFor = await lookingForMod.getById(req.params.id);
  if (lookingFor) {
    res.json(success(lookingFor));
  } else {
    res.status(500).json(fail("Não foi possível localizar a obra..."));
  }
});

/*
router.get('/', async(req, res) => {
  if(lookingFor.categorie == 'acao') {
    return review.categorie
  }
})
*/

router.post("/", /*validaToken,*/ async (req, res) => {
  const { categorie, ageGroup, time, expectation} = req.body;

  try {
    let lookingFor = await lookingForMod.save(categorie, ageGroup, time, expectation);

    res.json(success(lookingFor));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar pedido"));
  }
});

router.put("/:id", validaToken, async (req, res) => {
  const { id } = req.params;
  const { categorie, ageGroup, time, expectation } = req.body;

  let atualizacao = await lookingForMod.update(categorie, ageGroup, time, expectation);
  if (atualizacao) {
    res.json(success(atualizacao));
  } else {
    res.status(500).json(fail("Falha ao alterar pedido"));
  }
});

router.delete("/:id", validaToken, async (req, res) => {
  let atualizacao = await lookingForMod.delete(req.params.id);
  if (atualizacao) {
    res.json(success(atualizacao));
  } else {
    res.status(500).json(fail("Pedido não existe"));
  }
});

module.exports = router;
