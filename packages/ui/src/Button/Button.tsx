import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  appName: string;
};

export const Button = ({ children, appName }: ButtonProps) => {
  return (
    <button
      className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-500"
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
