import { Outlet } from "react-router";
import Header from "~/components/Header";

export default function SignedInLayout() {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-30">
        <Header />
      </div>
      <Outlet />
    </>
  );
}
