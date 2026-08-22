import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const formatJoi = (err: Joi.ValidationError) => err.details.map((e) => e.message).join(', ');

export class JoiErrorHandler {
    /** Express error-handling middleware for Joi validation errors. */
    static rest = (err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (err instanceof Joi.ValidationError) {
            return res.status(400).json({ error: formatJoi(err) });
        }
        return next(err);
    };
}

export const RestJoiErrorHandler = JoiErrorHandler.rest;
