import { buildApp } from '#app';

export const start = async () => {

    const app = buildApp();

    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exitCode = 1;
    }
}