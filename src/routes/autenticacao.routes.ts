
import { Router } from "express";
import {
  registar,
  verificarEmail,
  reenviarCodigo,
  login,
  recuperarSenha,
  redefinirSenha,
  logout,
  refreshToken
} from "../controllers/autenticacao.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Gestão de autenticação
 */

/* =========================
   REGISTAR
========================= */
/**
 * @swagger
 * /api/autenticacao/registar:
 *   post:
 *     summary: Criar conta
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - telefone
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 */
router.post("/registar", registar);

/* =========================
   VERIFICAR EMAIL
========================= */
/**
 * @swagger
 * /api/autenticacao/verificar-email:
 *   post:
 *     summary: Verificar email com código
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *             properties:
 *               email:
 *                 type: string
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verificado com sucesso
 */
router.post("/verificar-email", verificarEmail);

/* =========================
   REENVIAR CÓDIGO
========================= */
/**
 * @swagger
 * /api/autenticacao/reenviar-codigo:
 *   post:
 *     summary: Reenviar código de verificação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código reenviado
 */
router.post("/reenviar-codigo", reenviarCodigo);

/* =========================
   LOGIN
========================= */
/**
 * @swagger
 * /api/autenticacao/iniciar-sessao:
 *   post:
 *     summary: Login do utilizador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 */
router.post("/iniciar-sessao", login);

/* =========================
   RECUPERAR SENHA
========================= */
/**
 * @swagger
 * /api/autenticacao/esqueci-palavra-passe:
 *   post:
 *     summary: Recuperar palavra-passe
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Código enviado para o email
 */
router.post("/esqueci-palavra-passe", recuperarSenha);

/* =========================
   REDEFINIR SENHA
========================= */
/**
 * @swagger
 * /api/autenticacao/redefinir-palavra-passe:
 *   post:
 *     summary: Redefinir palavra-passe
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - codigo
 *               - novaSenha
 *             properties:
 *               email:
 *                 type: string
 *               codigo:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Palavra-passe redefinida com sucesso
 */
router.post("/redefinir-palavra-passe", redefinirSenha);

/**
 * @swagger
 * /api/autenticacao/logout:
 *   post:
 *     summary: Terminar sessão (logout)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessão terminada com sucesso
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/autenticacao/refresh-token:
 *   post:
 *     summary: Gerar novo access token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 */
router.post("/refresh-token", refreshToken);

export default router;

