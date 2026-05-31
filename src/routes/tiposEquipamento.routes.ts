import { Router } from "express";

import {
  criar,
  listar,
  ver,
  editar,
  remover,
} from "../controllers/tipoEquipamento.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tipos de Equipamento
 *   description: Gestão de tipos de equipamento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoEquipamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: Projetor
 *         descricao:
 *           type: string
 *           example: Equipamentos de projeção multimédia
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-05-28T10:00:00.000Z
 *
 *     CriarTipoEquipamentoDTO:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           example: Projetor
 *         descricao:
 *           type: string
 *           example: Equipamentos multimédia
 *
 *     EditarTipoEquipamentoDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: Impressora
 *         descricao:
 *           type: string
 *           example: Equipamentos de impressão
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         erro:
 *           type: boolean
 *           example: true
 *         mensagem:
 *           type: string
 *           example: Erro interno
 */

/**
 * =========================
 * CRIAR TIPO
 * =========================
 * @swagger
 * /api/tipos-equipamento:
 *   post:
 *     summary: Criar tipo de equipamento
 *     tags: [Tipos de Equipamento]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *
 *       Regras:
 *       - O nome deve ser único
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarTipoEquipamentoDTO'
 *     responses:
 *       201:
 *         description: Tipo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEquipamento'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post(
  "/",
  autenticar,
  permitirPapeis("ADMIN"),
  criar
);

/**
 * =========================
 * LISTAR
 * =========================
 * @swagger
 * /api/tipos-equipamento:
 *   get:
 *     summary: Listar tipos de equipamento
 *     tags: [Tipos de Equipamento]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *     responses:
 *       200:
 *         description: Lista de tipos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoEquipamento'
 *       401:
 *         description: Não autenticado
 */
router.get(
  "/",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO",
    "USUARIO"
  ),
  listar
);

/**
 * =========================
 * VER DETALHE
 * =========================
 * @swagger
 * /api/tipos-equipamento/{id}:
 *   get:
 *     summary: Ver detalhe de tipo de equipamento
 *     tags: [Tipos de Equipamento]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEquipamento'
 *       404:
 *         description: Tipo não encontrado
 */
router.get(
  "/:id",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO",
    "USUARIO"
  ),
  ver
);

/**
 * =========================
 * EDITAR
 * =========================
 * @swagger
 * /api/tipos-equipamento/{id}:
 *   patch:
 *     summary: Editar tipo de equipamento
 *     tags: [Tipos de Equipamento]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *
 *       Regras:
 *       - Nome único
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditarTipoEquipamentoDTO'
 *     responses:
 *       200:
 *         description: Tipo atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoEquipamento'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Tipo não encontrado
 */
router.patch(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  editar
);

/**
 * =========================
 * REMOVER
 * =========================
 * @swagger
 * /api/tipos-equipamento/{id}:
 *   delete:
 *     summary: Remover tipo de equipamento
 *     tags: [Tipos de Equipamento]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo removido
 *       404:
 *         description: Tipo não encontrado
 */
router.delete(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  remover
);

export default router;