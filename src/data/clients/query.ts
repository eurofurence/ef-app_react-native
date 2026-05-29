import { QueryClient } from "@tanstack/query-core";
import { authClient } from "@/data/clients/auth";

export const queryClient = new QueryClient();

let lastSub: string | undefined = undefined;

authClient.subscribe(() => {
  if (authClient.idData?.sub === lastSub) return;
  lastSub = authClient.idData?.sub;

  // Invalidate all authorized queries.
  queryClient
    .invalidateQueries({
      predicate(query) {
        // Opt-in queries that do not send token.
        return query.meta?.anon !== true;
      },
    })
    .catch(console.error);
});
