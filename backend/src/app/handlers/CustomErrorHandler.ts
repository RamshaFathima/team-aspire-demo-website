import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../enums/StatusCodes';

/**
 * Application-level validation/business error. Carries an optional HTTP status
 * code used by the REST error handler below.
 */
export class ValidationError extends Error {
    errorCode?: number;

    constructor(message: string, errorCode?: number) {
        super(message);
        this.name = 'ValidationError';
        this.errorCode = errorCode;
    }
}

export class CustomErrorHandler {
    /** Express error-handling middleware. */
    static rest = (err: any, _req: Request, res: Response, next: NextFunction) => {
        if (err && err.name === 'ValidationError') {
            return res
                .status(err.errorCode || StatusCodes.BAD_REQUEST)
                .json({ error: err.message });
        }
        return next(err);
    };
}

export const RestCustomErrorHandler = CustomErrorHandler.rest;
