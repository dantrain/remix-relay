import { useNavigation } from "@remix-run/react";
import { Progress as UiProgress } from "@repo/ui";
import { usePromiseTracker } from "react-promise-tracker";

export default function Progress() {
  const { state } = useNavigation();
  const { promiseInProgress } = usePromiseTracker();

  const isLoading =
    promiseInProgress || ["loading", "submitting"].includes(state);

  return <UiProgress isLoading={isLoading} />;
}
