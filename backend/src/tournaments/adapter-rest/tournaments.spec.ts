import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getApp } from '../../api/get-app.ts';
import { testDatabaseConnectionSetup, type TestEntityManager } from '../../tests/setup-testing-env.ts';
import { Tournament } from '../../entities/Tournament.entity.ts';
import { randomUUID } from 'node:crypto';

let setupEm: TestEntityManager;
let expectEm: TestEntityManager;
let app: ReturnType<typeof getApp>;

describe('Tournaments Router', () => {
    const testSetup = testDatabaseConnectionSetup()
    beforeAll(async () => {
        await testSetup.beforeAll();
        const setup = await testSetup.forgeTestExecutionEnv();
        setupEm = setup.setupEm;
        expectEm = setup.expectEm;
        app = setup.app;
    });

    afterAll(testSetup.afterAll);

    test('GET /api/tournaments - Should list all tournaments', async () => {
        const id = randomUUID();
        const tournament = setupEm.create(Tournament, {
            id,
            name: 'Test Tournament',
            start_date: new Date(),
            description: 'Test description',
            end_date: new Date(),
            city: 'Test City',
        })
        await setupEm.persistAndFlush(tournament);

        const req = await app.request('/api/tournaments');

        const result = await req.json();

        expect(result).toMatchObject([{
            id,
            name: tournament.name,
            description: tournament.description,
            city: tournament.city,
        }]);

        expect(result[0].start_date.split('T')[0]).toBe(tournament.start_date.toISOString().split('T')[0]);
        expect(result[0].end_date.split('T')[0]).toBe(tournament.end_date?.toISOString().split('T')[0]);

        expect(200).toBe(req.status); // Accept 404 or 200 depending on route setup
    });

    test('GET /api/tournaments/{id} - Should get one specific tournament', async () => {
        const id = randomUUID();
        const tournament = setupEm.create(Tournament, {
            id,
            name: 'Test Tournament',
            start_date: new Date(),
            description: 'Test description',
            end_date: new Date(),
            city: 'Test City',
        })
        await setupEm.persistAndFlush(tournament);

        const req = await app.request(`/api/tournaments/${id}`);

        const result = await req.json();

        expect(result).toMatchObject({
            id,
            name: tournament.name,
            city: tournament.city,
        });

        expect(result.start_date.split('T')[0]).toBe(tournament.start_date.toISOString().split('T')[0]);
        expect(result.end_date.split('T')[0]).toBe(tournament.end_date?.toISOString().split('T')[0]);

        expect(200).toBe(req.status); // Accept 404 or 200 depending on route setup
    });

        test('GET /api/tournaments/{id} - Should 404 when getting a non-existent tournament', async () => {
        const nonExistantId = randomUUID();
        const tournament = setupEm.create(Tournament, {
            name: 'Test Tournament',
            start_date: new Date(),
            description: 'Test description',
            end_date: new Date(),
            city: 'Test City',
        })
        await setupEm.persistAndFlush(tournament);

        const req = await app.request(`/api/tournaments/${nonExistantId}`);

        const result = await req.text();

        expect(result).toBe('Not found');
        expect(404).toBe(req.status); // Accept 404 or 200 depending on route setup
    });

});
