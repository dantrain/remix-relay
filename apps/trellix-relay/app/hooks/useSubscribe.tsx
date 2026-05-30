import { isEqual } from "lodash-es";
import { createContext, use, useMemo, useRef } from "react";
import { useSubscription } from "react-relay";
import { GraphQLSubscriptionConfig, OperationType } from "relay-runtime";

export const ResubscribeContext = createContext(0);

export function useSubscribe<T extends OperationType>(
  config: GraphQLSubscriptionConfig<T>,
  requestSubscriptionFn?: Parameters<typeof useSubscription<T>>[1],
) {
  const windowVisibleSignal = use(ResubscribeContext);
  const configRef = useRef(config);
  const signalRef = useRef(0);

  /* eslint-disable react-hooks/refs */
  if (!isEqual(config, configRef.current)) {
    configRef.current = config;
    signalRef.current += 1;
  }
  /* eslint-enable react-hooks/refs */

  return useSubscription<T>(
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps, react-hooks/use-memo
    useMemo(() => config, [signalRef.current + windowVisibleSignal]),
    requestSubscriptionFn,
  );
}
