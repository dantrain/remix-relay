import { Spinner } from "./Spinner";

export default function LoadingScreen() {
  return (
    <div
      className="animate-in fade-in grid flex-1 self-stretch
        [animation-duration:1500ms]"
    >
      <div className="animate-pulse bg-[#afbccc] [grid-area:1/1]" />
      <div className="animate-fade flex justify-center pt-12 [grid-area:1/1]">
        <Spinner />
      </div>
    </div>
  );
}
