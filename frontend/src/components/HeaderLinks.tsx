import { FC } from "react";
import { Button } from "@/components/ui/button";

const HeaderLinks: FC = () => {
  const links = [
    { label: "Dashboard" },
    { label: "Quick board" }
  ];

  return (
    <div className="mx-5 flex items-center space-x-4">
      {links.map((link, index) => (
        <Button key={index} variant="mild" >
          {link.label}
        </Button>
      ))}
    </div>
  );
};

export default HeaderLinks;
