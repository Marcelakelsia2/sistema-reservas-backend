import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Reservas",
      version: "1.0.0",
      description: "Documentação da API do sistema de reservas",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Autenticação", description: "Registo, login e recuperação" },
      { name: "Utilizadores", description: "Gestão de utilizadores" },
      { name: "Tipos de Sala", description: "CRUD de tipos de sala" },
      { name: "Salas", description: "Gestão das salas" },
      { name: "Tipos de Equipamento", description: "CRUD de tipos de equipamento" },
      { name: "Equipamentos", description: "Gestão de equipamentos" },
      { name: "Reservas", description: "Gestão de reservas" },
      { name: "Notificações", description: "Notificações do sistema" },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
});