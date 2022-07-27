import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import setupEndpoints from './endpoints.mjs';
import { setup as setupErrorHandler } from './services/errorHandler.mjs';
import { setup as setupPassport } from './services/passport.mjs';

const client = process.env.CLIENT_ORIGIN || 'http://localhost:8080';
const mongo = process.env.MONGO_URI || 'mongodb://localhost/voxeltoy';
const port = process.env.PORT || 8081;

mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', () => mongoose.connect(mongo));
mongoose.connect(mongo);

const app = express();
app.use(helmet());
app.use(cors({ origin: client }));
app.use(express.json({ limit: '1mb' }));
setupPassport();
setupEndpoints(app);
setupErrorHandler(app);

const server = app.listen(port);

const shutdown = () => (
  server.close(() => (
    mongoose.connection.close(
      false,
      () => process.nextTick(() => process.exit(0)),
    )
  ))
);
process
  .on('SIGTERM', shutdown)
  .on('SIGINT', shutdown);
