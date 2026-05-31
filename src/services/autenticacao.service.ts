import { prisma } from "../lib/prisma";

import { encriptarSenha, compararSenha } from "../utils/senha";
import { gerarToken, verificarToken } from "../utils/jwt";
import { gerarCodigo } from "../utils/token";
import { enviarEmail } from "../utils/email";
import { HttpError } from "../utils/httpError";

// Registar utilizador
export async function registar(data: {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}) {
  // Verifica email existente
  const emailExiste = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
  });

  if (emailExiste) {
    throw new HttpError("Email já utilizado.", 400);
  }

  // Verifica telefone existente
  const telefoneExiste = await prisma.usuario.findUnique({
    where: {
      telefone: data.telefone,
    },
  });

  if (telefoneExiste) {
    throw new HttpError("Telefone já utilizado.", 400);
  }

 if (data.nome.trim().split(" ").length < 2) {
    throw new HttpError("O nome deve conter pelo menos 2 palavras.", 400);
  }

  // Hash da senha
  const senhaHash = await encriptarSenha(data.senha);

  // Código de verificação
  const codigo = gerarCodigo();

  // Expiração
  const expira = new Date(Date.now() + 15 * 60 * 1000);

  // Criação do utilizador
  const usuario = await prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      senha: senhaHash,
      codigoVerificacao: codigo,
      codigoExpiraEm: expira,
    },
  });

  // Envio de email
  await enviarEmail(
    usuario.email,
    "Verificação de Conta",
    `O seu código de verificação é: ${codigo}`
  );

  return usuario;
}

// Verificar email
export async function verificarEmail(email: string, codigo: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new HttpError("Utilizador não encontrado.", 404);
  }

  if (!usuario.codigoVerificacao) {
    throw new HttpError("Código inválido.", 400);
  }

  if (usuario.codigoVerificacao !== codigo) {
    throw new HttpError("Código incorreto.", 400);
  }

  if (
    usuario.codigoExpiraEm &&
    usuario.codigoExpiraEm < new Date()
  ) {
    throw new HttpError("Código expirado.", 400);
  }

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      emailVerificado: true,
      codigoVerificacao: null,
      codigoExpiraEm: null,
    },
  });

  return {
    mensagem: "Email verificado com sucesso.",
  };
}

// Reenviar código
export async function reenviarCodigo(email: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new HttpError("Utilizador não encontrado.", 404);
  }

  const codigo = gerarCodigo();

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      codigoVerificacao: codigo,
      codigoExpiraEm: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await enviarEmail(
    usuario.email,
    "Novo Código",
    `O seu novo código é: ${codigo}`
  );

  return {
    mensagem: "Novo código enviado.",
  };
}

// Login
export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

 if (!usuario) {
  throw new HttpError("Credenciais inválidas.", 401);
}

  if (!usuario.ativo) {
    throw new HttpError("Conta desativada.", 403);
  }

  if (!usuario.emailVerificado) {
    throw new HttpError("Email não verificado.", 400);
  }

  const senhaValida = await compararSenha(
    senha,
    usuario.senha
  );

  if (!senhaValida) {
    throw new HttpError("Credenciais inválidas.", 401);
  }

  if (!usuario.ativo) {
  throw new Error("Conta desativada. Contacte o administrador.");
}

if (!usuario.emailVerificado) {
  throw new Error("Confirme o seu email antes de iniciar sessão.");
}

  const token = gerarToken({
    id: usuario.id,
    role: usuario.role,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  };
}

// Recuperar senha
export async function recuperarSenha(email: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new HttpError("Utilizador não encontrado.", 404);
  }

  const codigo = gerarCodigo();

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      codigoRecuperacao: codigo,
      codigoRecuperacaoExpiraEm: new Date(
        Date.now() + 15 * 60 * 1000
      ),
    },
  });

  await enviarEmail(
    usuario.email,
    "Recuperação de Palavra-passe",
    `O seu código de recuperação é: ${codigo}`
  );

  return {
    mensagem: "Código enviado para o email.",
  };
}

// Redefinir senha
export async function redefinirSenha(
  email: string,
  codigo: string,
  novaSenha: string
) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new HttpError("Utilizador não encontrado.", 404);
  }

  if (usuario.codigoRecuperacao !== codigo) {
    throw new HttpError("Código inválido.", 400);
  }

  if (
    usuario.codigoRecuperacaoExpiraEm &&
    usuario.codigoRecuperacaoExpiraEm < new Date()
  ) {
    throw new HttpError("Código expirado.", 400);
  }

  const senhaHash = await encriptarSenha(novaSenha);

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      senha: senhaHash,
      codigoRecuperacao: null,
      codigoRecuperacaoExpiraEm: null,
    },
  });

  return {
    mensagem: "Palavra-passe redefinida com sucesso.",
  };
}

//logout
export async function logout() {
  return {
    mensagem: "Sessão terminada com sucesso.",
  };
}
 //REFRESH TOKEN
export async function refreshToken(refreshToken: string) {
  try {
    const payload = verificarToken(refreshToken) as any;

    const novoToken = gerarToken({
      id: payload.id,
      role: payload.role,
    });

    return {
      token: novoToken,
    };
  } catch {
    throw new Error("Refresh token inválido ou expirado.");
  }
}