import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createServer } from '../mcp/server';

// Public, unauthenticated MCP endpoint (Streamable HTTP, stateless, JSON responses).
// SWA route rules can't add headers to /api responses, so CORS is handled here.
const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
    'Access-Control-Max-Age': '86400',
};

const methodNotAllowed = (): HttpResponseInit => ({
    status: 405,
    headers: { ...CORS_HEADERS, Allow: 'POST, OPTIONS', 'Content-Type': 'application/json' },
    // Stateless server: no standalone SSE stream (GET) and no sessions to terminate (DELETE)
    body: JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed.' }, id: null }),
});

export async function mcpHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (request.method === 'OPTIONS') return { status: 204, headers: CORS_HEADERS };
    if (request.method !== 'POST') return methodNotAllowed();

    const server = createServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    });

    try {
        await server.connect(transport);

        const response = await transport.handleRequest(
            new Request(request.url, {
                method: request.method,
                headers: Object.fromEntries(request.headers.entries()),
                body: await request.text(),
            })
        );

        return {
            status: response.status,
            headers: { ...Object.fromEntries(response.headers.entries()), ...CORS_HEADERS },
            body: response.body ? await response.text() : undefined,
        };
    } catch (err) {
        context.error('MCP request failed', err);
        return {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null }),
        };
    } finally {
        await transport.close();
        await server.close();
    }
}

app.http('mcp', {
    route: 'mcp',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: mcpHandler,
});
