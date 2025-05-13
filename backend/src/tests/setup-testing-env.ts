import { GenericContainer, type StartedTestContainer } from "testcontainers";
import baseMikroOrmConfig from "../mikro-orm.config.ts";
import { defineConfig, MikroORM } from "@mikro-orm/mysql";
import { createHttpApp } from "../api/create-http-app.ts";
import { registerAppRoutes } from "../api/register-app-routes.ts";


const containerConfig = {
    image: "mysql",
    port: 3306,
    env: {
        MYSQL_ROOT_PASSWORD: "password",
        MYSQL_DATABASE: "test"
    }
}


export function testDatabaseConnectionSetup(params?: { logging?: boolean, useAuth?: boolean }) {
    const { logging = false, useAuth = false } = params || {};

    const log = (message: string) => {
        if (logging) console.log(`[Test Setup] ${message}`);
    }

    let mySqlContainer: StartedTestContainer;
    let ormInstance: MikroORM;


    async function setupMySqlContainer() {
        log("[Test Setup] Starting MySQL container...");
        mySqlContainer = await new GenericContainer(containerConfig.image)
            .withExposedPorts(containerConfig.port)
            .withEnvironment(containerConfig.env)
            .start();
        log("[Test Setup] MySQL container started");
    }

    async function forgeTestExecutionEnv() {
        if (!mySqlContainer) {
            throw new Error("MySQL container is not started");
        }

        log("[Test Setup] Setting up MikroORM with MySQL container...");
        const mikroOrmConfig = defineConfig({
            ...baseMikroOrmConfig,
            user: "root",
            dbName: containerConfig.env.MYSQL_DATABASE,
            password: containerConfig.env.MYSQL_ROOT_PASSWORD,
            host: mySqlContainer.getHost(),
            logger: log,
            port: mySqlContainer.getMappedPort(containerConfig.port),
        });

        const orm = await MikroORM.init(mikroOrmConfig);

        log("[Test Setup] MikroORM initialized");
        log("[Test Setup] Running migrations...");
        await orm.getMigrator().up();
        log("[Test Setup] Migrations completed");
        ormInstance = orm;

        const app = registerAppRoutes(createHttpApp({ em: orm.em.fork(), useLogger: false, useAuth }));

        return { setupEm: orm.em.fork(), expectEm: orm.em, app };
    }

    async function beforeAll() {
        await setupMySqlContainer();
        await forgeTestExecutionEnv();
    }
    async function afterAll() {
        if (!ormInstance || !mySqlContainer) {
            throw new Error("ORM instance or MySQL container is not initialized");
        }
        log("[Test Setup] Closing MikroORM and container instance...");
        await ormInstance.close(true);
        await mySqlContainer.stop();
        log("[Test Setup] MikroORM and container instance closed");
    }

    return {
        beforeAll,
        forgeTestExecutionEnv,
        afterAll,
    }
}

export type TestEntityManager = Awaited<ReturnType<typeof MikroORM.init>>['em'];