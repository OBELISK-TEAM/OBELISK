import { FC } from "react";

export const BoardDetailsSidebar: FC = () => {
  return (
    <div
      className="transition-width group flex w-14 flex-col justify-between border-r border-border bg-background shadow-md duration-300 ease-in-out hover:w-52"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <nav className="flex flex-col space-y-2 p-2">{/*todo: implement buttons properly*/}</nav>
    </div>
  );
};
