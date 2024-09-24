import { FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeaderLinks: FC = () => {
  const links = [
    { label: "Dashboard", href: "/user-boards" },
    { label: "Quick board", href: "/board" },
  ];

  return (
    <div className="mx-5 flex items-center space-x-4">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          <Button variant="mild">{link.label}</Button>
        </Link>
      ))}
    </div>
  );
};

export default HeaderLinks;
