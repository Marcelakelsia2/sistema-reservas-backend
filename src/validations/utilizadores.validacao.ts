import { z } from "zod";

export const atualizarPerfilSchema = z.object({
  nome: z
    .string()
    .min(5, "O nome deve ter pelo menos 2 palavras")
    .optional(),

  telefone: z
    .string()
    .regex(
      /^\d{9}$/,
      "O telefone deve ter 9 dígitos"
    )
    .optional(),
});

export const alterarSenhaSchema = z.object({
  senhaAtual: z.string(),

  novaSenha: z
    .string()
    .min(
      8,
      "A nova senha deve ter pelo menos 8 caracteres"
    )
    .regex(
      /[A-Za-z]/,
      "A senha deve conter letras"
    )
    .regex(
      /[0-9]/,
      "A senha deve conter números"
    ),
});

export const alterarRoleSchema = z.object({
  role: z.enum([
    "ADMIN",
    "FUNCIONARIO",
    "USUARIO",
  ]),
});

export const alterarEstadoSchema = z.object({
  ativo: z.boolean(),
});