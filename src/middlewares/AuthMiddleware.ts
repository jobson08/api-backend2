import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
interface IPayload { sub: string; }

class AuthMiddleware {
    auth(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).json({
                code: 'token.missing',
                message: 'Token ausente',
            });
        }
        const [, token] = authHeader.split(' ');
        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN
        if (!secretKey) {
            throw new Error('token não Valido')
        }
        try {
            const { sub }= verify(token, secretKey) as IPayload;
            request.user_id = sub;
            return next();
        } catch (error) {
            return response.status(401).json({
                code: 'token.expires',
                message: 'Token Aspirado.',
            });
        }
    }
}

export { AuthMiddleware }