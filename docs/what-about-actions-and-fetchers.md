## What about actions?

In a vanilla React Router app, data mutations are done through [Route actions](https://reactrouter.com/start/framework/actions). When the action completes, all loader data on the page is revalidated. This results in at least two sequential round-trips to the server, and could mean refetching a lot of data that has not changed as a result of the action.

Only one action can be defined per route, so [multiple switch cases](https://github.com/remix-run/example-trellix/blob/main/app/routes/board.%24id/route.tsx#L48) are needed in the action to support multiple mutations per page.

[Relay mutations](https://relay.dev/docs/tutorial/mutations-updates/) should be used instead when using remix-relay.

GraphQL mutations include a query so that updated data can be returned in a single round-trip, and Relay takes care of updating the store and triggering a re-render of the UI. Relay makes it easy to implement optimistic UI, show pending states etc.

You can define any number of mutations independent of routes. For example you could define a mutation within a `LikeButton` component, and include that component in multiple routes.

The caveat is you must take care writing the queries for updated data, for instance when adding/removing items from lists or updating an item count. This is the trade-off compared to revalidating everything.

One other advantage of Route actions is they can work with the native HTML form submission behaviour and therefore can work without JavaScript (if it fails to load for instance), a form of progressive enhancement. A Relay app will require JavaScript to work.

## What about fetchers?

In a vanilla React Router app, [fetchers](https://reactrouter.com/how-to/fetchers) are used to load data without causing a navigation.

Relay provides many ways to do this, see:

- [Queries for Interactions](https://relay.dev/docs/tutorial/queries-2/)
- [Refetchable Fragments](https://relay.dev/docs/tutorial/refetchable-fragments/)
- [Connections & Pagination](https://relay.dev/docs/tutorial/connections-pagination/)
