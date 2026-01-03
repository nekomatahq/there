import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query';
import { BSON } from 'bson';

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                serializeData: BSON.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                deserializeData: BSON.deserialize,
            },
        },
    });
}