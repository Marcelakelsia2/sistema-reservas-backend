import { Router } from "express";
import {
  criar,
  listar,
  minhas,
  ver,
  cancelar,
  historico,
  conflitos
} from "../controllers/reservaEquipamento.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservas de Equipamentos
 *   description: Gestão de reservas de equipamentos
 */

/**
 * =========================
 * CRIAR RESERVA
 * =========================
 * @swagger
 * /api/reservas-equipamentos:
 *   post:
 *     summary: Criar reserva de equipamento
 *     tags: [Reservas de Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *
 *       Regras:
 *       - Não pode exceder quantidade disponível
 *       - Não pode haver conflito de horário/data
 *       - Equipamento deve estar disponível
 *       - Reserva pode ser por intervalo de tempo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipamentoId
 *               - quantidade
 *               - data
 *               - horaInicio
 *               - horaFim
 *             properties:
 *               equipamentoId:
 *                 type: integer
 *                 example: 2
 *               quantidade:
 *                 type: integer
 *                 example: 1
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-28"
 *               horaInicio:
 *                 type: string
 *                 example: "08:00"
 *               horaFim:
 *                 type: string
 *                 example: "12:00"
 *               observacao:
 *                 type: string
 *                 example: "Projetor para apresentação"
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Erro de validação ou conflito
 *       401:
 *         description: Não autenticado
 */
router.post(
  "/",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),

);

/**
 * =========================
 * LISTAR TODAS
 * =========================
 * @swagger
 * /api/reservas-equipamentos:
 *   get:
 *     summary: Listar reservas de equipamentos
 *     tags: [Reservas de Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN e FUNCIONARIO
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get(
  "/",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  listar
);

/**
 * =========================
 * MINHAS RESERVAS
 * =========================
 * @swagger
 * /api/reservas-equipamentos/minhas:
 *   get:
 *     summary: Minhas reservas de equipamentos
 *     tags: [Reservas de Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista do utilizador
 */
router.get(
  "/minhas",
  autenticar,
  permitirPapeis("USUARIO"),
  minhas
);

/**
 * =========================
 * VER RESERVA
 * =========================
 * @swagger
 * /api/reservas-equipamentos/{id}:
 *   get:
 *     summary: Ver reserva de equipamento
 *     tags: [Reservas de Equipamentos]
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
 *         description: Reserva encontrada
 *       404:
 *         description: Não encontrada
 */
router.get(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  ver
);

/**
 * =========================
 * CANCELAR
 * =========================
 * @swagger
 * /api/reservas-equipamentos/{id}/cancelar:
 *   patch:
 *     summary: Cancelar reserva de equipamento
 *     tags: [Reservas de Equipamentos]
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
 *         description: Cancelado com sucesso
 */
router.patch(
  "/:id/cancelar",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  cancelar
);

/**
 * =========================
 * HISTÓRICO
 * =========================
 * @swagger
 * /api/reservas-equipamentos/historico:
 *   get:
 *     summary: Histórico de reservas de equipamentos
 *     tags: [Reservas de Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico carregado
 */
router.get(
  "/historico",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  historico
);

/**
 * =========================
 * CONFLITOS
 * =========================
 * @swagger
 * /api/reservas-equipamentos/conflitos:
 *   get:
 *     summary: Ver conflitos de equipamentos
 *     tags: [Reservas de Equipamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conflitos
 */
router.get(
  "/conflitos",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  conflitos
);

export default router;