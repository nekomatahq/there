import { createTRPCRouter } from '../init';
import { thereRouter } from './there';

export const appRouter = createTRPCRouter({
  there: thereRouter,
});

export type AppRouter = typeof appRouter;
