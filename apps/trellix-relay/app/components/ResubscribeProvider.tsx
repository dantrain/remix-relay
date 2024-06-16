import { ReactNode, useState } from "react";
import { ResubscribeContext } from "~/hooks/useSubscribe";
import useWindowVisible from "~/hooks/useWindowVisible";

export function ResubscribeProvider({ children }: { children: ReactNode }) {
  const [signal, setSignal] = useState(0);

  useWindowVisible(() => setSignal((key) => key + 1));

  return (
    <ResubscribeContext.Provider value={signal}>
      {children}
    </ResubscribeContext.Provider>
  );
}
