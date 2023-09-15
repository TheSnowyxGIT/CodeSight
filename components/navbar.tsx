"use client";

import * as React from "react";
import { Newspaper, HomeIcon } from "lucide-react";
import Image from "next/image";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { categories, DocPages } from "./pages/pages";
import { useRouter } from "next/navigation";

export function NavBar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container h-14 flex items-center">
        <div className="hidden md:flex mr-4">
          <a
            className="flex items-center space-x-6 text-sm font-medium"
            href={`${process.env.NEXT_PUBLIC_BASE_PATH}/`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/code-sight-logo.png`}
              width={40}
              height={40}
              alt="Logo"
            />
            <span className="">CodeSight</span>
          </a>
        </div>
        <a href="/" className="px-0 py-2 mr-3 h-auto md:hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/code-sight-logo.png`}
            width={40}
            height={40}
            alt="Logo"
          />
        </a>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              onClick={() => setOpen(true)}
              variant={"outline"}
              className="text-muted-foreground w-full md:w-40 lg:w-64 justify-start sm:pr-12 text-sm relative h-9"
            >
              <span className="inline-flex lg:hidden">Search...</span>
              <span className="hidden lg:inline-flex">Search Algorithm...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-[50%] translate-y-[-50%] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem
                    onSelect={() => {
                      router.push(`/`);
                      setOpen(false);
                    }}
                  >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </CommandItem>
                </CommandGroup>
                {Object.keys(categories).map((cat) => {
                  const title = categories[cat];
                  return (
                    <CommandGroup key={cat} heading={title}>
                      {Object.keys(DocPages[cat]).map((pageName) => {
                        const page = DocPages[cat][pageName];
                        return (
                          <CommandItem
                            key={pageName}
                            onSelect={() => {
                              router.push(`${page.link}`);
                              setOpen(false);
                            }}
                          >
                            <Newspaper className="mr-2 h-4 w-4" />
                            <span>{page.title}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </CommandList>
            </CommandDialog>
          </div>
        </div>
      </div>
    </header>
  );
}
