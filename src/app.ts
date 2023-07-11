import express from 'express';
import authRoutes from './modules/auth/auth.controller';


const v1Api = express();

v1Api.use(express.json());
v1Api.use('/v1/auth', authRoutes);

export default v1Api;
