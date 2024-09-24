import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

const ThemeToggle: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-6 w-6 border p-5" />; // a placeholder so that so that the toggle doesn't show up suddenly
  }

  if (resolvedTheme === "dark") {
    return (
      <Button variant={"outline"} className="px-2" onClick={() => setTheme("light")}>
        <Sun className="h-6 w-6" />
      </Button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <Button variant={"outline"} className="px-2" onClick={() => setTheme("dark")}>
        <Moon className="h-6 w-6" />
      </Button>
    );
  }
};

export default ThemeToggle;
