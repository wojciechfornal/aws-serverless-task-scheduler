import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

const healthApiOpts = {
    schema: {
        response: {
            200: Type.Object({
                status: Type.String()
            })
        }
    }
}

export async function routes(fastify: FastifyInstance) {

    fastify.get('/health', healthApiOpts, (_req, res) => {
        res.status(200).send({ status: 'OK' });
    });

}