import { Response } from "express";
import * as service from "../services/reserva.service";
import { AuthRequest } from "../middlewares/autenticar";

// CRIAR RESERVA
export async function criar(req: AuthRequest, res: Response) {
  const data = await service.criar(req.body, req.usuario!.id);

  return res.status(201).json({
    erro: false,
    dados: data,
  });
}

// LISTAR TODAS (ADMIN / FUNCIONÁRIO)
export async function listar(req: AuthRequest, res: Response) {
  const data = await service.listar();

  return res.json({
    erro: false,
    dados: data,
  });
}

// MINHAS RESERVAS (USUÁRIO)
export async function minhas(req: AuthRequest, res: Response) {
  const data = await service.minhas(req.usuario!.id);

  return res.json({
    erro: false,
    dados: data,
  });
}

// VER RESERVA
export async function ver(req: AuthRequest, res: Response) {
  const data = await service.ver(
    Number(req.params.id),
    req.usuario!
  );

  return res.json({
    erro: false,
    dados: data,
  });
}

// CANCELAR RESERVA
export async function cancelar(req: AuthRequest, res: Response) {
  const data = await service.cancelar(
    Number(req.params.id),
    req.usuario!
  );

  return res.json({
    erro: false,
    dados: data,
  });
}

// HISTÓRICO
export async function historico(req: AuthRequest, res: Response) {
  const data = await service.historico(req.usuario!.id);

  return res.json({
    erro: false,
    dados: data,
  });
}

// CONFLITOS
export async function conflitos(req: AuthRequest, res: Response) {
  const data = await service.conflitos();

  return res.json({
    erro: false,
    dados: data,
  });
}