import { isEqual } from "lodash-es";
import {
  ReactNode,
  createContext,
  useContext,
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

  return (
    <ResubscribeContext.Provider value={signal}>
      {children}
    </ResubscribeContext.Provider>
  );
}

export function useSubscribe<T extends OperationType>(
  config: GraphQLSubscriptionConfig<T>,
  requestSubscriptionFn?: Parameters<typeof useSubscription<T>>[1],
) {
  const windowVisibleSignal = useContext(ResubscribeContext);
  const configRef = useRef(config);
  const signalRef = useRef(0);

  if (!isEqual(config, configRef.current)) {
    configRef.current = config;
    signalRef.current += 1;
  }

  return useSubscription<T>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useMemo(() => config, [signalRef.current + windowVisibleSignal]),
    requestSubscriptionFn,
  );
}
