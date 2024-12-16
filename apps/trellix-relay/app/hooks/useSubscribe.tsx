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

  if (!isEqual(config, configRef.current)) {
    configRef.current = config;
    signalRef.current += 1;
  }

  return useSubscription<T>(
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => config, [signalRef.current + windowVisibleSignal]),
    requestSubscriptionFn,
  );
}
