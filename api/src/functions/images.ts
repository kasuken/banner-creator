import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { UserFacingError } from '../errors';
import { getPhotoForUse, searchPhotos } from '../mcp/unsplash';

// Server-side proxy for Unsplash so the access key never reaches the browser bundle.
const MAX_QUERY_LENGTH = 100;
const MAX_PER_PAGE = 30;
const DEFAULT_PER_PAGE = 12;
const ORIENTATIONS = ['landscape', 'portrait', 'squarish'] as const;
type Orientation = (typeof ORIENTATIONS)[number];

const respond = (status: number, body: unknown): HttpResponseInit => ({
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
});

const failure = (err: unknown, context: InvocationContext): HttpResponseInit => {
    if (err instanceof UserFacingError) return respond(502, { error: err.message });
    context.error('Unsplash request failed', err);
    return respond(500, { error: 'Unexpected server error.' });
};

export async function searchImagesHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const query = (request.query.get('query') ?? '').trim();
    if (!query) return respond(400, { error: 'The "query" parameter is required.' });
    if (query.length > MAX_QUERY_LENGTH) {
        return respond(400, { error: `The "query" parameter must be ${MAX_QUERY_LENGTH} characters or fewer.` });
    }

    const requested = Number(request.query.get('per_page') ?? DEFAULT_PER_PAGE);
    const perPage = Number.isFinite(requested)
        ? Math.min(MAX_PER_PAGE, Math.max(1, Math.round(requested)))
        : DEFAULT_PER_PAGE;

    const orientation = request.query.get('orientation');
    if (orientation && !ORIENTATIONS.includes(orientation as Orientation)) {
        return respond(400, { error: `"orientation" must be one of: ${ORIENTATIONS.join(', ')}.` });
    }

    try {
        return respond(200, { results: await searchPhotos(query, perPage, orientation ?? undefined) });
    } catch (err) {
        return failure(err, context);
    }
}

export async function photoHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const id = request.params.id ?? '';
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return respond(400, { error: 'Invalid photo id.' });

    try {
        return respond(200, await getPhotoForUse(id));
    } catch (err) {
        return failure(err, context);
    }
}

app.http('images-search', {
    route: 'images/search',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: searchImagesHandler,
});

app.http('images-photo', {
    route: 'images/photos/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: photoHandler,
});
