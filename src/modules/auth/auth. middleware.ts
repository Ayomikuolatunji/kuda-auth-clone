import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { throwError } from '../../middleware/requestErrorHandler';
import { StatusCodes } from 'http-status-codes';

class AuthMiddleware {
    verifyToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['x-access-token'];
        if (!token) {
            throwError("No token provided", StatusCodes.BAD_REQUEST)
        }
        jwt.verify(token as string, process.env.SECRET as Secret, (err, decoded: any) => {
            if (err) {
                throwError("Failed to authenticate token", StatusCodes.INTERNAL_SERVER_ERROR)
            }
            req.userId = decoded.id;
            next();
        });
    }
}

export default new AuthMiddleware();
