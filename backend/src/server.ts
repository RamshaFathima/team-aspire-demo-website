import http from 'http';
import serverConfig from './config/expressConfig';
import { sequelizeConnect } from './config/sequelizeConfig';
import { redisConnect, redisDisconnect } from './app/common/redis.client';
import logger from './app/utils/Logger';

require('dotenv').config();

const port = process.env.PORT || 8000;

(async () => {
    const app = await serverConfig();

    if (!process.env.DB_DIALECT) {
        throw new Error('DB_DIALECT not found in .env file');
    }

    if (!['postgres', 'mysql', 'mariadb', 'sqlite', 'mssql'].includes(process.env.DB_DIALECT)) {
        throw new Error('DB_DIALECT must be a Sequelize SQL dialect (postgres recommended)');
    }

    try {
        await sequelizeConnect();
    } catch (err) {
        logger.error({ err }, 'Unable to connect to the database');
        throw err;
    }

    try {
        await redisConnect();
    } catch (err) {
        logger.error({ err }, 'Unable to connect to Redis');
        throw err;
    }

    const httpServer = http.createServer(app);

    httpServer.listen(port, () => {
        logger.info(`Aspire API listening on port ${port}`);
    });

    const shutdown = async (signal: string) => {
        logger.info(`${signal} received — shutting down gracefully`);
        httpServer.close();
        await redisDisconnect();
        process.exit(0);
    };
    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
})();
