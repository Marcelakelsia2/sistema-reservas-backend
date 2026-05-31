import { Router } from "express";
import * as controller from "../controllers/tipoSala.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tipos de Sala
 *   description: Gestão de tipos de sala
 */

/**
 * @swagger
 * /api/tipos-sala:
 *   post:
 *     summary: Criar tipo de sala
 *     description: Apenas ADMIN pode criar tipos de sala
 *     tags: [Tipos de Sala]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Sala de Reuniões
 *               descricao:
 *                 type: string
 *                 example: Sala equipada para reuniões
 *     responses:
 *       201:
 *         description: Tipo de sala criado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 */
router.post(
  "/",
  autenticar,
  permitirPapeis("ADMIN"),
  controller.criar
);

/**
 * @swagger
 * /api/tipos-sala:
 *   get:
 *     summary: Listar tipos de sala
 *     description: ADMIN, FUNCIONARIO e USUARIO autenticado podem visualizar
 *     tags: [Tipos de Sala]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de sala
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *       401:
 *         description: Não autenticado
 */
router.get(
  "/",
  autenticar,
  controller.listar
);

/**
 * @swagger
 * /api/tipos-sala/{id}:
 *   get:
 *     summary: Ver tipo de sala por ID
 *     description: ADMIN, FUNCIONARIO e USUARIO autenticado podem visualizar
 *     tags: [Tipos de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de sala
 *     responses:
 *       200:
 *         description: Tipo encontrado
 *       404:
 *         description: Não encontrado
 *       401:
 *         description: Não autenticado
 */
router.get(
  "/:id",
  autenticar,
  controller.ver
);

/**
 * @swagger
 * /api/tipos-sala/{id}:
 *   patch:
 *     summary: Atualizar tipo de sala
 *     description: Apenas ADMIN pode atualizar tipos de sala
 *     tags: [Tipos de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Sala VIP
 *               descricao:
 *                 type: string
 *                 example: Sala premium
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 */
router.patch(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  controller.editar
);

/**
 * @swagger
 * /api/tipos-sala/{id}:
 *   delete:
 *     summary: Remover tipo de sala
 *     description: Apenas ADMIN pode remover tipos de sala
 *     tags: [Tipos de Sala]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do tipo de sala
 *     responses:
 *       200:
 *         description: Removido com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (apenas ADMIN)
 */
router.delete(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  controller.remover
);

export default router;