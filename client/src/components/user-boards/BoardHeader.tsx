import React from "react";
interface SectionHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}
export const BoardHeader: React.FC<SectionHeaderProps> = ({ title, description, children }) => {
  return (
    <div>
      <h1 className="flex items-center gap-3 font-bold text-card-foreground" style={{ fontSize: "20px" }}>
        {title} <div>{children}</div>
      </h1>
      <span className="text-muted-foreground" style={{ fontSize: "15px" }}>
        {description}
      </span>
    </div>
  );
};
