const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userMod = require("../model/user");
const { success, fail } = require("../helpers/resposta");
require("dotenv").config();

//Verificar se é admin
function checkAdmin(req, res, next) {
  const { isAdmin } = req.user;

  if (isAdmin) {
    next();
  } else {
    res.status(403).json(fail("Acesso negao. Usuário não é administrador!"));
  }
}

//Verificar o Token
function validaToken(req, res, next) {
  //Extrai o token do cabeçalho da requisição
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json(fail("Token de autentificação não fornecido!"));
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
      console.log("Erro: Verificação do Token!", err);
      return res.status(401).json(fail("Token de autentificação inválido!"));
    }

    try {
      const user = await userMod.getByLogin(decoded.login);

      if (!user) {
        return res.status(401).json(fail("Usuário não foi encontrado!"));
      }

      //Adiciona as informações do user no obj de requisição
      req.user = {
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin,
        contador: user.contador,
      };
      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(fail("Erro ao obter informações do usuário!"));
    }
  });
}

//Fazendo Login e devolvendo um Token
router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  const user = await userMod.getByLogin(login);
  if (user && user.password === password) {
    // await userMod.contUser(user.id);
    const token = jwt.sign({ login }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });

    res.json(success({ token }));
  } else {
    res.status(401).json(fail("Credenciais inválidas"));
  }
});

//Listagem de usuários(paginados)
router.get("/", validaToken, async (req, res) => {
  const limite = parseInt(req.query.limite);
  const pagina = parseInt(req.query.pagina);

  const startIndex = (pagina - 1) * limite;
  const endIndex = pagina * limite;

  try {
    const users = await userMod.list();

    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json(success(paginatedUsers, "Listando"));
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao listar usuários"));
  }
});

//Listagem de usuários (especifico)
router.get("/:id", validaToken, async (req, res) => {
  try {
    const user = await userMod.getById(req.params.id);
    if (user) {
      res.json(success(user));
    } else {
      res
        .status(500)
        .json(fail("Não foi possível localizar o usuário específico"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao obter usuário"));
  }
});

//Cria um novo usuário
router.post("/",/* validaToken, checkAdmin,*/ async (req, res) => {
  const { login, password, isAdmin } = req.body;

  try {
    const user = await userMod.save(login, password, isAdmin);
    if (user) {
      res.json(success(user));
    } else {
      res.status(500).json(fail("Falha ao salvar o novo usuário"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar o novo usuário"));
  }
});

//Cria um novo usuário administrador
router.post("/admin", validaToken, checkAdmin, async (req, res) => {
  const { login, password } = req.body;
  const isAdmin = true;

  try {
    const user = await userMod.save(login, password, isAdmin);
    if (user) {
      res.json(success(user));
    } else {
      res.status(500).json(fail("Falha ao salvar o novo administrador"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao salvar o novo administrador"));
  }
});

//Atualiza informações do usuário (admin).
router.put("/admin/:id", validaToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { login, password, isAdmin } = req.body;

  try {
    const result = await userMod.update(id, login, password, isAdmin);
    if (result) {
      res.json(success(result));
    } else {
      res.status(500).json(fail("Falha ao alterar o usuário"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao alterar o usuário"));
  }
});

// Atualiza informações do próprio usuário.
router.put("/:id", validaToken, async (req, res) => {
  const { id } = req.params;
  const { login, password, isAdmin } = req.body;

  if (req.user.id !== id) {
    return res
      .status(401)
      .json(
        fail("Acesso não autorizado. Você só pode alterar sua própria conta")
      );
  }

  try {
    const result = await userMod.update(id, login, password, isAdmin);
    if (result) {
      res.json(success(result));
    } else {
      res.status(500).json(fail("Falha ao alterar o usuário"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao alterar o usuário"));
  }
});

//Exclui um usuário (admin).
router.delete("/:id", validaToken, checkAdmin, async (req, res) => {
  try {
    const result = await userMod.delete(req.params.id);
    if (result) {
      res.json(success(result));
    } else {
      res.status(500).json(fail("Usuário não encontrado"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(fail("Erro ao excluir o usuário"));
  }
});

module.exports = router;
