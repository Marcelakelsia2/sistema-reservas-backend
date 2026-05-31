import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor a correr na porta ${PORTA}`);
});