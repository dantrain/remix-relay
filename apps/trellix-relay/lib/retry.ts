import pRetry from "p-retry";

export const retry = <T>(input: () => T) => pRetry(input, { retries: 2 });
