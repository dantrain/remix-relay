import { isEqual } from "lodash-es";
import {
  ReactNode,
  createContext,
  use,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSubscription } from "react-relay";
import { GraphQLSubscriptionConfig, OperationType } from "relay-runtime";
import useWindowVisible from "./useWindowVisible";

const ResubscribeContext = createContext(0);

export function ResubscribeProvider({ children }: { children: ReactNode }) {
  const [signal, setSignal] = useState(0);

  useWindowVisible(() => setSignal((key) => key + 1));

  return <ResubscribeContext value={signal}>{children}</ResubscribeContext>;
}

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
