
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme();

  return theme === "system" ? (
    systemTheme === "dark" ? (
      <Button size={"icon"} onClick={() => setTheme("light")}>
        <Sun />
      </Button>
    ) : (
      <Button size={"icon"} onClick={() => setTheme("dark")}>
        <Moon />
      </Button>
    )
  ) : theme === "dark" ? (
    <Button size={"icon"} onClick={() => setTheme("light")}>
      <Sun />
    </Button>
  ) : (
    <Button size={"icon"} onClick={() => setTheme("dark")}>
      <Moon />
    </Button>
  );
}
