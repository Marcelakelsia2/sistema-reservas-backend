import { Router } from "express";

import {
  criar,
  listar,
  ver,
  editar,
  disponibilidade,
  quantidade,
  estado,
  disponiveis,
  conflitos,
  remover,
} from "../controllers/equipamento.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Equipamentos
 *   description: Gestão de equipamentos
 */

/**
 * @swagger
 * /api/equipamentos:
 *   post:
 *     summary: Criar equipamento
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Apenas ADMIN.
 *
 *       Regras:
 *       - Código único
 *       - Quantidade disponível não pode ser superior à quantidade total
 *       - Tipo de equipamento deve existir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nome
 *               - quantidadeTotal
 *               - quantidadeDisponivel
 *               - tipoEquipamentoId
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: PROJ001
 *               nome:
 *                 type: string
 *                 example: Projetor Epson
 *               descricao:
 *                 type: string
 *                 example: Projetor Full HD
 *               quantidadeTotal:
 *                 type: integer
 *                 example: 10
 *               quantidadeDisponivel:
 *                 type: integer
 *                 example: 10
 *               tipoEquipamentoId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Equipamento criado com sucesso
 *       400:
 *         description: Dados inválidos
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
 * @swagger
 * /api/equipamentos:
 *   get:
 *     summary: Listar equipamentos
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Perfis permitidos:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *     responses:
 *       200:
 *         description: Lista de equipamentos
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
 * @swagger
 * /api/equipamentos/{id}:
 *   get:
 *     summary: Ver equipamento
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipamento encontrado
 *       404:
 *         description: Equipamento não encontrado
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
 * @swagger
 * /api/equipamentos/{id}:
 *   patch:
 *     summary: Editar equipamento
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Projetor Epson X2
 *               descricao:
 *                 type: string
 *                 example: Nova descrição
 *               quantidadeTotal:
 *                 type: integer
 *                 example: 15
 *               quantidadeDisponivel:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Equipamento actualizado
 *       404:
 *         description: Equipamento não encontrado
 */
router.patch(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  editar
);

/**
 * @swagger
 * /api/equipamentos/{id}/disponibilidade:
 *   patch:
 *     summary: Alterar disponibilidade
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN e FUNCIONARIO
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum:
 *                   - DISPONIVEL
 *                   - INDISPONIVEL
 *                   - MANUTENCAO
 *                 example: DISPONIVEL
 *     responses:
 *       200:
 *         description: Disponibilidade alterada
 *       404:
 *         description: Equipamento não encontrado
 */
router.patch(
  "/:id/disponibilidade",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO"
  ),
  disponibilidade
);

/**
 * @swagger
 * /api/equipamentos/{id}/quantidade:
 *   patch:
 *     summary: Alterar quantidade
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN e FUNCIONARIO
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidadeDisponivel
 *             properties:
 *               quantidadeDisponivel:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       200:
 *         description: Quantidade alterada
 *       400:
 *         description: Quantidade inválida
 *       404:
 *         description: Equipamento não encontrado
 */
router.patch(
  "/:id/quantidade",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO"
  ),
  quantidade
);

/**
 * @swagger
 * /api/equipamentos/{id}/estado:
 *   patch:
 *     summary: Alterar estado
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN
 *     responses:
 *       200:
 *         description: Estado alterado
 */
router.patch(
  "/:id/estado",
  autenticar,
  permitirPapeis("ADMIN"),
  estado
);

/**
 * @swagger
 * /api/equipamentos/disponiveis:
 *   get:
 *     summary: Ver disponíveis
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de equipamentos disponíveis
 */
router.get(
  "/disponiveis",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO",
    "USUARIO"
  ),
  disponiveis
);

/**
 * @swagger
 * /api/equipamentos/conflitos:
 *   get:
 *     summary: Ver conflitos
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Apenas:
 *       - ADMIN
 *       - FUNCIONARIO
 *     responses:
 *       200:
 *         description: Lista de conflitos
 */
router.get(
  "/conflitos",
  autenticar,
  permitirPapeis(
    "ADMIN",
    "FUNCIONARIO"
  ),
  conflitos
);

/**
 * @swagger
 * /api/equipamentos/{id}:
 *   delete:
 *     summary: Remover equipamento
 *     tags: [Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN
 *     responses:
 *       200:
 *         description: Equipamento removido
 */
router.delete(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  remover
);

export default router;