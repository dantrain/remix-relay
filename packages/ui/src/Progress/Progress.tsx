import { useNProgress } from "@tanem/react-nprogress";
import {
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group";

const Bar = forwardRef<HTMLDivElement, { state: TransitionStatus }>(
  ({ state }, ref) => {
    const { animationDuration, isFinished, progress } = useNProgress({
      isAnimating: state === "entered",
    });

    return (
      <div
        className="absolute left-0 z-50 h-[2px] w-full"
        ref={ref}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          opacity:
            (state === "exiting" || state === "exited") && isFinished ? 0 : 1,
          transition: `all ${animationDuration}ms linear`,
        }}
      >
        <div
          className="absolute right-0 h-full w-28 translate-x-[1px]
            translate-y-[-4px] rotate-3 bg-white"
          style={{
            boxShadow: "0 0 10px rgb(255 255 255), 0 0 5px rgb(255 255 255)",
          }}
        />
        <div className="relative z-10 h-full w-full bg-white" />
      </div>
    );
  },
);

Bar.displayName = "Bar";

export function Progress({ isLoading }: { isLoading: boolean }) {
  const [bar, setBar] = useState<{
    key: number;
    nodeRef: RefObject<HTMLDivElement>;
  } | null>(null);

  const isLoadingRef = useRef(isLoading);
  const keyRef = useRef(0);

  useEffect(() => {
    if (isLoading && !isLoadingRef.current) {
      keyRef.current++;
      setBar({ key: keyRef.current, nodeRef: createRef() });
    } else if (!isLoading && isLoadingRef.current) {
      setBar(null);
    }

    isLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <TransitionGroup
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1
        overflow-hidden"
    >
      {bar ? (
        <Transition
          key={bar.key}
          mountOnEnter
          nodeRef={bar.nodeRef}
          timeout={{
            exit: 500,
          }}
          unmountOnExit
        >
          {(state) => <Bar ref={bar.nodeRef} state={state} />}
        </Transition>
      ) : null}
    </TransitionGroup>
  );
}
