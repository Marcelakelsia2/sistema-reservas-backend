import { Router } from "express";
import {
  criar,
  listar,
  minhas,
  ver,
  cancelar,
  historico,
  conflitos
} from "../controllers/reserva.controller";

import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gestão completa de reservas de salas
 */

/**
 * =========================
 * CRIAR RESERVA
 * =========================
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Criar reserva de sala
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permissões:
 *       - ADMIN
 *       - FUNCIONARIO
 *       - USUARIO
 *
 *       Regras:
 *       - Não pode haver sobreposição de horários
 *       - Sala deve estar disponível
 *       - Data/hora deve ser válida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salaId
 *               - data
 *               - horaInicio
 *               - horaFim
 *             properties:
 *               salaId:
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
 *                 example: "10:00"
 *               observacao:
 *                 type: string
 *                 example: "Reunião de equipa"
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 */
router.post(
  "/",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  criar
);

/**
 * =========================
 * LISTAR RESERVAS
 * =========================
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Listar todas as reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN e FUNCIONARIO
 *     responses:
 *       200:
 *         description: Lista de reservas
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
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
 * /api/reservas/minhas:
 *   get:
 *     summary: Listar reservas do utilizador logado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas do utilizador
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
 * /api/reservas/{id}:
 *   get:
 *     summary: Ver reserva por ID
 *     tags: [Reservas]
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
 *         description: Reserva não encontrada
 */
router.get(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  ver
);

/**
 * =========================
 * CANCELAR RESERVA
 * =========================
 * @swagger
 * /api/reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar reserva
 *     tags: [Reservas]
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
 *         description: Reserva cancelada
 *       400:
 *         description: Não é possível cancelar
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
 * /api/reservas/historico:
 *   get:
 *     summary: Histórico de reservas
 *     tags: [Reservas]
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
 * /api/reservas/conflitos:
 *   get:
 *     summary: Ver conflitos de reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conflitos
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/conflitos",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  conflitos
);

export default router;