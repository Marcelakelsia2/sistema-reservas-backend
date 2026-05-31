import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/httpError";

// VALIDAR FORMATO HH:mm
function validarHora(hora: string) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!regex.test(hora)) {
    throw new HttpError(
      "Formato de hora inválido. Use HH:mm",
      400
    );
  }
}

// VALIDAR HORÁRIO
function validarHorario(
  inicio: string,
  fim: string
) {
  validarHora(inicio);
  validarHora(fim);

  const dataInicio = new Date(
    `1970-01-01T${inicio}:00`
  );

  const dataFim = new Date(
    `1970-01-01T${fim}:00`
  );

  if (dataInicio >= dataFim) {
    throw new HttpError(
      "Hora de início deve ser menor que hora de fim",
      400
    );
  }
}

// VALIDAR NÚMEROS
function validarNumeroPositivo(
  valor: number,
  campo: string
) {
  if (valor <= 0) {
    throw new HttpError(
      `${campo} deve ser maior que zero`,
      400
    );
  }
}

// CRIAR SALA
export async function criar(data: any) {
  if (!data.nome) {
    throw new HttpError(
      "Nome é obrigatório",
      400
    );
  }

  if (!data.capacidade) {
    throw new HttpError(
      "Capacidade é obrigatória",
      400
    );
  }

  if (!data.localizacao) {
    throw new HttpError(
      "Localização é obrigatória",
      400
    );
  }

  if (!data.tipoSalaId) {
    throw new HttpError(
      "Tipo da sala é obrigatório",
      400
    );
  }

  validarNumeroPositivo(
    Number(data.capacidade),
    "Capacidade"
  );

  validarHorario(
    data.horaInicioFuncionamento,
    data.horaFimFuncionamento
  );

  const salaExistente =
    await prisma.sala.findFirst({
      where: {
        nome: data.nome,
      },
    });

  if (salaExistente) {
    throw new HttpError(
      "Já existe uma sala com este nome",
      400
    );
  }

  const tipoSala =
    await prisma.tipoSala.findUnique({
      where: {
        id: Number(data.tipoSalaId),
      },
    });

  if (!tipoSala) {
    throw new HttpError(
      "Tipo de sala não encontrado",
      404
    );
  }

  return prisma.sala.create({
    data: {
      nome: data.nome,
      capacidade: Number(data.capacidade),
      localizacao: data.localizacao,
      descricao: data.descricao,
      estado: data.estado,
      horaInicioFuncionamento:
        data.horaInicioFuncionamento,
      horaFimFuncionamento:
        data.horaFimFuncionamento,
      tipoSalaId: Number(data.tipoSalaId),
    },

    include: {
      tipoSala: true,
    },
  });
}

// LISTAR
export async function listar() {
  return prisma.sala.findMany({
    include: {
      tipoSala: true,
    },

    orderBy: {
      nome: "asc",
    },
  });
}

// VER
export async function ver(id: number) {
  if (!id || id <= 0) {
    throw new HttpError(
      "ID inválido",
      400
    );
  }

  const sala = await prisma.sala.findUnique({
    where: { id },

    include: {
      tipoSala: true,
    },
  });

  if (!sala) {
    throw new HttpError(
      "Sala não encontrada",
      404
    );
  }

  return sala;
}

// EDITAR
export async function editar(
  id: number,
  data: any
) {
  await ver(id);

  if (data.capacidade) {
    validarNumeroPositivo(
      Number(data.capacidade),
      "Capacidade"
    );
  }

  if (
    data.horaInicioFuncionamento &&
    data.horaFimFuncionamento
  ) {
    validarHorario(
      data.horaInicioFuncionamento,
      data.horaFimFuncionamento
    );
  }

  if (data.nome) {
    const salaExistente =
      await prisma.sala.findFirst({
        where: {
          nome: data.nome,
          NOT: {
            id,
          },
        },
      });

    if (salaExistente) {
      throw new HttpError(
        "Já existe outra sala com este nome",
        400
      );
    }
  }

  return prisma.sala.update({
    where: { id },

    data: {
      nome: data.nome,
      capacidade: data.capacidade
        ? Number(data.capacidade)
        : undefined,

      localizacao: data.localizacao,
      descricao: data.descricao,
      estado: data.estado,

      horaInicioFuncionamento:
        data.horaInicioFuncionamento,

      horaFimFuncionamento:
        data.horaFimFuncionamento,

      tipoSalaId: data.tipoSalaId
        ? Number(data.tipoSalaId)
        : undefined,
    },

    include: {
      tipoSala: true,
    },
  });
}

// ALTERAR DISPONIBILIDADE
export async function alterarDisponibilidade(
  id: number,
  estado: string
) {
  await ver(id);

  const estadosValidos = [
    "DISPONIVEL",
    "INDISPONIVEL",
    "MANUTENCAO",
  ];

  if (!estadosValidos.includes(estado)) {
    throw new HttpError(
      "Estado inválido",
      400
    );
  }

  return prisma.sala.update({
    where: { id },

    data: {
      estado: estado as any,
    },
  });
}

// REMOVER
export async function remover(id: number) {
  await ver(id);

  const reservas =
    await prisma.reserva.findFirst({
      where: {
        salaId: id,
      },
    });

  if (reservas) {
    throw new HttpError(
      "Não é possível remover sala com reservas",
      400
    );
  }

  return prisma.sala.delete({
    where: { id },
  });
}

// SALAS DISPONÍVEIS
export async function disponiveis(data: any) {
  if (
    !data.data ||
    !data.horaInicio ||
    !data.horaFim
  ) {
    throw new HttpError(
      "Data e horários são obrigatórios",
      400
    );
  }

  validarHorario(
    data.horaInicio,
    data.horaFim
  );

  const inicio = new Date(
    `${data.data}T${data.horaInicio}:00`
  );

  const fim = new Date(
    `${data.data}T${data.horaFim}:00`
  );

  const reservasConflito =
    await prisma.reserva.findMany({
      where: {
        status: {
          not: "CANCELADA",
        },

        horaInicio: {
          lt: fim,
        },

        horaFim: {
          gt: inicio,
        },
      },

      select: {
        salaId: true,
      },
    });

  const salasIndisponiveis =
    reservasConflito.map(
      (reserva) => reserva.salaId
    );

  return prisma.sala.findMany({
    where: {
      estado: "DISPONIVEL",

      id: {
        notIn: salasIndisponiveis,
      },
    },

    include: {
      tipoSala: true,
    },
  });
}

// CONFLITOS
export async function conflitos() {
   return prisma.reserva.findMany({
    where: {
      status: {
        not: "CANCELADA",
      },
    },

    include: {
      sala: true,
      usuario: true,
    },

    orderBy: {
      horaInicio: "asc",
    },
  });
}