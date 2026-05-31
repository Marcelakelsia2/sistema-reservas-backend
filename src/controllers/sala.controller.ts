import { Request, Response } from "express";
import * as service from "../services/sala.service";

// CRIAR SALA
export async function criar(req: Request, res: Response) {
  const sala = await service.criar(req.body);

  return res.status(201).json({
    sucesso: true,
    mensagem: "Sala criada com sucesso",
    dados: sala,
  });
}

// LISTAR SALAS
export async function listar(req: Request, res: Response) {
  const salas = await service.listar();

  return res.status(200).json({
    sucesso: true,
    dados: salas,
  });
}

// VER SALA
export async function ver(req: Request, res: Response) {
  const sala = await service.ver(Number(req.params.id));

  return res.status(200).json({
    sucesso: true,
    dados: sala,
  });
}

// EDITAR SALA
export async function editar(req: Request, res: Response) {
  const sala = await service.editar(
    Number(req.params.id),
    req.body
  );

  return res.status(200).json({
    sucesso: true,
    mensagem: "Sala actualizada com sucesso",
    dados: sala,
  });
}

// ALTERAR DISPONIBILIDADE
export async function disponibilidade(
  req: Request,
  res: Response
) {
  const sala = await service.alterarDisponibilidade(
    Number(req.params.id),
    req.body.estado
  );

  return res.status(200).json({
    sucesso: true,
    mensagem: "Estado actualizado com sucesso",
    dados: sala,
  });
}

// REMOVER SALA
export async function remover(req: Request, res: Response) {
  await service.remover(Number(req.params.id));

  return res.status(200).json({
    sucesso: true,
    mensagem: "Sala removida com sucesso",
  });
}

// SALAS DISPONÍVEIS
export async function disponiveis(
  req: Request,
  res: Response
) {
  const salas = await service.disponiveis({
    data: String(req.query.data),
    horaInicio: String(req.query.horaInicio),
    horaFim: String(req.query.horaFim),
  });

  return res.status(200).json({
    sucesso: true,
    dados: salas,
  });
}

// CONFLITOS
export async function conflitos(
  req: Request,
  res: Response
) {
  const conflitos = await service.conflitos();

  return res.status(200).json({
    sucesso: true,
    dados: conflitos,
  });
}