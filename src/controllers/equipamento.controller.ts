
import { Request, Response } from "express";

import * as service from "../services/equipamento.service";

// CRIAR
export async function criar(
  req: Request,
  res: Response
) {
  const equipamento = await service.criar(
    req.body
  );

  return res.status(201).json(equipamento);
}

// LISTAR
export async function listar(
  req: Request,
  res: Response
) {
  const equipamentos = await service.listar();

  return res.json(equipamentos);
}

// VER
export async function ver(
  req: Request,
  res: Response
) {
  const equipamento = await service.ver(
    Number(req.params.id)
  );

  return res.json(equipamento);
}

// EDITAR
export async function editar(
  req: Request,
  res: Response
) {
  const equipamento = await service.editar(
    Number(req.params.id),
    req.body
  );

  return res.json(equipamento);
}

// DISPONIBILIDADE
export async function disponibilidade(
  req: Request,
  res: Response
) {
  const equipamento =
    await service.alterarDisponibilidade(
      Number(req.params.id),
      req.body.estado
    );

  return res.json(equipamento);
}

// QUANTIDADE
export async function quantidade(
  req: Request,
  res: Response
) {
  const equipamento =
    await service.alterarQuantidade(
      Number(req.params.id),
      req.body
    );

  return res.json(equipamento);
}

// ESTADO
export async function estado(
  req: Request,
  res: Response
) {
  const equipamento =
    await service.alterarEstado(
      Number(req.params.id),
      req.body.estado
    );

  return res.json(equipamento);
}

// DISPONÍVEIS
export async function disponiveis(
  req: Request,
  res: Response
) {
  const equipamentos =
    await service.disponiveis();

  return res.json(equipamentos);
}

// CONFLITOS
export async function conflitos(
  req: Request,
  res: Response
) {
  const dados = await service.conflitos();

  return res.json(dados);
}

// REMOVER
export async function remover(
  req: Request,
  res: Response
) {
  await service.remover(
    Number(req.params.id)
  );

  return res.json({
    mensagem: "Equipamento removido com sucesso",
  });
}