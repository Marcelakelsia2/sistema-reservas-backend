import { Router } from "express";
import * as controller from "../controllers/sala.controller";
import { autenticar } from "../middlewares/autenticar";
import { permitirPapeis } from "../middlewares/permitirPapeis";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gestão completa de salas
 */

// 🟢 CRIAR SALA (ADMIN)
/**
 * @swagger
 * /api/salas:
 *   post:
 *     summary: Criar sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode criar salas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - capacidade
 *               - localizacao
 *               - tipoSalaId
 *               - horaInicioFuncionamento
 *               - horaFimFuncionamento
 *             properties:
 *               nome:
 *                 type: string
 *               capacidade:
 *                 type: number
 *               localizacao:
 *                 type: string
 *               descricao:
 *                 type: string
 *               estado:
 *                 type: string
 *                 example: DISPONIVEL
 *               horaInicioFuncionamento:
 *                 type: string
 *                 example: "08:00"
 *               horaFimFuncionamento:
 *                 type: string
 *                 example: "18:00"
 *               tipoSalaId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.post(
  "/",
  autenticar,
  permitirPapeis("ADMIN"),
  controller.criar
);

// 📄 LISTAR SALAS (TODOS)
/**
 * @swagger
 * /api/salas:
 *   get:
 *     summary: Listar todas as salas
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: Todos os utilizadores autenticados podem visualizar as salas
 *     responses:
 *       200:
 *         description: Lista de salas
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  controller.listar
);

// 🔎 VER SALA POR ID (TODOS)
/**
 * @swagger
 * /api/salas/{id}:
 *   get:
 *     summary: Obter sala por ID
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: Todos os utilizadores autenticados podem visualizar uma sala específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Sala não encontrada
 */
router.get(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO", "USUARIO"),
  controller.ver
);

// ✏️ EDITAR SALA (ADMIN E FUNCIONARIO)
/**
 * @swagger
 * /api/salas/{id}:
 *   put:
 *     summary: Editar sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN pode editar salas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sala actualizada
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Sala não encontrada
 */
router.put(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  controller.editar
);

// 🔄 ALTERAR DISPONIBILIDADE (ADMIN E FUNCIONARIO)
/**
 * @swagger
 * /api/salas/{id}/disponibilidade:
 *   patch:
 *     summary: Alterar estado da sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN e FUNCIONARIO podem alterar a disponibilidade da sala
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                 example: DISPONIVEL
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Sala não encontrada
 */
router.patch(
  "/:id/disponibilidade",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  controller.disponibilidade
);

// 🟢 SALAS DISPONÍVEIS (USUARIO)
/**
 * @swagger
 * /api/salas/disponiveis:
 *   get:
 *     summary: Consultar salas disponíveis
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: Todos os utilizadores autenticados podem consultar salas disponíveis por horário
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-28
 *       - in: query
 *         name: horaInicio
 *         required: true
 *         schema:
 *           type: string
 *           example: "08:00"
 *       - in: query
 *         name: horaFim
 *         required: true
 *         schema:
 *           type: string
 *           example: "10:00"
 *     responses:
 *       200:
 *         description: Lista de salas disponíveis
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/disponiveis",
  autenticar,
  permitirPapeis("USUARIO"),
  controller.disponiveis
);

// ⚠️ CONFLITOS DE RESERVAS
/**
 * @swagger
 * /api/salas/conflitos:
 *   get:
 *     summary: Ver conflitos de reservas
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: ADMIN e FUNCIONARIO podem visualizar conflitos de reservas
 *     responses:
 *       200:
 *         description: Lista de conflitos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/conflitos",
  autenticar,
  permitirPapeis("ADMIN", "FUNCIONARIO"),
  controller.conflitos
);

// ❌ REMOVER SALA (ADMIN)
/**
 * @swagger
 * /api/salas/{id}:
 *   delete:
 *     summary: Remover sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     description: Apenas ADMIN pode remover salas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sala removida
 *       400:
 *         description: Sala com reservas
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Sala não encontrada
 */
router.delete(
  "/:id",
  autenticar,
  permitirPapeis("ADMIN"),
  controller.remover
);

export default router;