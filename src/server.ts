import bodyParser from "body-parser";
import express from "express"
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import compression from "compression";
import requestHeaders from "./middleware/requestHeaders";
import { handleServerError } from "./middleware/requestErrorHandler";
import prisma from "./database/database";
import { PrismaClient } from "@prisma/client";
import { pageNotFound } from "./middleware/404Page";
import v1Api from "./app";
import { config } from "./configurations/config";
const swaggerDocument = require('../swagger.json')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "*" }));

app.options("*", cors());

app.use(compression());

app.use(requestHeaders);


app.use("/api", v1Api)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(pageNotFound);
app.use(handleServerError);

class CreateDBConnect {
  db: PrismaClient;
  constructor() {
    this.db = prisma;
  }
  async connect() {
    try {
      await this.db.$connect();
      console.log("Connected to database successfully");
      app.listen(config.server.PORT, () =>
        console.log(`Server started on port ${config.server.PORT}`)
      );
    } catch (error: any) {
      console.error("Failed to connect to database", error.message);
    }
  }
  async disconnect() {
    await this.db.$disconnect();
  }
}
const dbConnect = new CreateDBConnect();
dbConnect.connect();
