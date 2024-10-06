import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}
const BoardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-1">
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};
export default BoardLayout;
