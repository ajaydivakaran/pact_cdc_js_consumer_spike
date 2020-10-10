const { Pact } = require('@pact-foundation/pact');
const { string } = require('@pact-foundation/pact').Matchers;
const { fetchQuote } = require('./consumer');
const path = require('path');

const PORT = 6000;
const URL = 'http://localhost';

const provider = new Pact({
    consumer: 'JS Consumer',
    provider: 'quoteService',
    port: PORT,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
});

describe('Quote Service', () => {
    describe('When a request to fetch a given quote', () => {
        beforeAll(() =>
            provider.setup().then(() => {
                provider.addInteraction({
                    state: 'with quote id1',
                    uponReceiving: 'fetch quote with given id',
                    withRequest: {
                        method: 'GET',
                        path: '/quote',
                        query: {id: "1"}
                    },
                    willRespondWith: {
                        status: 200,
                        body: {
                            message: string("some quote"),
                            id: string("1")
                        }
                    },
                });
            })
        );

        test('should return the correct data', async () => {
            const response = await fetchQuote(URL, PORT, "1");
            expect(response.message).toBe('some quote');
            expect(response.id).toBe("1");
        });

        afterEach(() => provider.verify());
        afterAll(() => provider.finalize());
    });
});
