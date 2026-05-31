import { Router } from "express";

import {
  listarUtilizadores,
  meuPerfil,
  verUtilizador,
  atualizarPerfil,
  alterarPalavraPasse,
  alterarTipoUtilizador,
  alterarEstado,
  removerUtilizador,
} from "../controllers/utilizador.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilizadores
 *   description: Gestão de utilizadores do sistema
 */


/**
 * @swagger
 * /api/utilizadores:
 *   get:
 *     summary: Listar utilizadores
 *     description: |
 *       Lista todos os utilizadores do sistema.
 *
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 *
 *       401:
 *         description: Token inválido ou não enviado
 *
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  listarUtilizadores
);


/**
 * @swagger
 * /api/utilizadores/me:
 *   get:
 *     summary: Ver perfil autenticado
 *
 *     description: |
 *       Retorna os dados do utilizador autenticado.
 *
 *       Permissões:
 *       - Todos autenticados
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Perfil do utilizador
 *
 *       401:
 *         description: Token inválido
 */
router.get(
  "/me",
  autenticar,
  meuPerfil
);


/**
 * @swagger
 * /api/utilizadores/me:
 *   patch:
 *     summary: Atualizar perfil
 *
 *     description: |
 *       Permite ao utilizador autenticado atualizar o próprio perfil.
 *
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Manuel
 *
 *               telefone:
 *                 type: string
 *                 example: 923456789
 *
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *
 *       400:
 *         description: Dados inválidos
 *
 *       401:
 *         description: Não autenticado
 */
router.patch(
  "/me",
  autenticar,
  atualizarPerfil
);


/**
 * @swagger
 * /api/utilizadores/me/palavra-passe:
 *   patch:
 *     summary: Alterar palavra-passe
 *
 *     description: |
 *       Permite alterar a palavra-passe da conta autenticada.
 *
 *       Regras:
 *       - mínimo 8 caracteres
 *       - deve conter letras
 *       - deve conter números
 *
 *       Permissões:
 *       - Todos autenticados
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 example: senha123
 *
 *               novaSenha:
 *                 type: string
 *                 example: NovaSenha123
 *
 *     responses:
 *       200:
 *         description: Palavra-passe alterada
 *
 *       400:
 *         description: Dados inválidos
 *
 *       401:
 *         description: Não autenticado
 */
router.patch(
  "/me/palavra-passe",
  autenticar,
  alterarPalavraPasse
);


/**
 * @swagger
 * /api/utilizadores/{id}:
 *   get:
 *     summary: Ver utilizador
 *
 *     description: |
 *       Retorna os dados de um utilizador específico.
 *
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Utilizador encontrado
 *
 *       404:
 *         description: Utilizador não encontrado
 *
 *       401:
 *         description: Não autenticado
 *
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  verUtilizador
);


/**
 * @swagger
 * /api/utilizadores/{id}/tipo:
 *   patch:
 *     summary: Alterar tipo de utilizador
 *
 *     description: |
 *       Altera o papel do utilizador.
 *
 *       Apenas ADMIN pode executar esta ação.
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - role
 *
 *             properties:
 *               role:
 *                 type: string
 *
 *                 enum:
 *                   - ADMIN
 *                   - FUNCIONARIO
 *                   - USUARIO
 *
 *                 example: FUNCIONARIO
 *
 *     responses:
 *       200:
 *         description: Tipo alterado
 *
 *       401:
 *         description: Não autenticado
 *
 *       403:
 *         description: Sem permissão
 */
router.patch(
  "/:id/tipo",
  autenticar,
  permitirPapeis("ADMIN"),
  alterarTipoUtilizador
);


/**
 * @swagger
 * /api/utilizadores/{id}/estado:
 *   patch:
 *     summary: Bloquear ou desbloquear utilizador
 *
 *     description: |
 *       Ativa ou desativa a conta de um utilizador.
 *
 *       Apenas ADMIN pode executar esta ação.
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - ativo
 *
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *       200:
 *         description: Estado alterado
 *
 *       401:
 *         description: Não autenticado
 *
 *       403:
 *         description: Sem permissão
 */
router.patch(
  "/:id/estado",
  autenticar,
  permitirPapeis("ADMIN"),
  alterarEstado
);


/**
 * @swagger
 * /api/utilizadores/{id}:
 *   delete:
 *     summary: Remover utilizador
 *
 *     description: |
 *       Remove permanentemente um utilizador.
 *
 *       Apenas ADMIN pode executar esta ação.
 *
 *     tags: [Utilizadores]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Utilizador removido
 *
 *       401:
 *         description: Não autenticado
 *
 *       403:
 *         description: Sem permissão
 *
 *       404:
 *         description: Utilizador não encontrado
 */
router.delete(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  removerUtilizador
);

export default router;