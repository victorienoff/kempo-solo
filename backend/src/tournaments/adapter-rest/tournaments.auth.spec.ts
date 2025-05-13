import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getApp } from '../../api/get-app.ts';
import { testDatabaseConnectionSetup, type TestEntityManager } from '../../tests/setup-testing-env.ts';
import { Tournament } from '../../entities/Tournament.entity.ts';
import { randomUUID } from 'node:crypto';
import { use } from 'hono/jsx';

let setupEm: TestEntityManager;
let expectEm: TestEntityManager;
let app: ReturnType<typeof getApp>;

describe('Tournaments Router with Auth', () => {
    const testSetup = testDatabaseConnectionSetup({useAuth: true})
    beforeAll(async () => {
        await testSetup.beforeAll();
        const setup = await testSetup.forgeTestExecutionEnv();
        setupEm = setup.setupEm;
        expectEm = setup.expectEm;
        app = setup.app;
    });

    afterAll(testSetup.afterAll);

    

    test('GET /api/tournaments/{id} - Should 401 when no token given', async () => {
        

        const req = await app.request(`/api/tournaments/${randomUUID()}`);

        const result = await req.text();

        expect(result).toBe('Unauthorized');
        expect(401).toBe(req.status); // Accept 404 or 200 depending on route setup
    });
});
