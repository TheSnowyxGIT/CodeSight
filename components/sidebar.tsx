"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  Columns,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";
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
import { DocPages, categories } from "./pages/pages";

export interface SideBarProps {
  className?: string;
  currentPage: string;
}

export default class SideBar extends React.Component<SideBarProps> {
  render(): React.ReactNode {
    return (
      <div className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-55rem))] right-auto 3xl:w-[22rem] 2xl:w-[19rem] lg:w-[14rem] pb-10 pl-8 pr-6 overflow-y-auto">
        <nav className="lg:text-sm lg:leading-6 relative">
          <ul>
            {Object.keys(categories).map((cat) => {
              const catTitle = categories[cat];
              const subs = DocPages[cat];
              return (
                <li key={cat} className="mt-12 lg:mt-8">
                  <h5 className="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                    {catTitle}
                  </h5>
                  <ul>
                    {Object.keys(subs).map((sub) => {
                      const link = subs[sub].link;
                      let style =
                        "block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300";
                      if (this.props.currentPage === link) {
                        style =
                          "block border-l pl-4 -ml-px text-sky-500 border-current font-semibold dark:text-sky-400";
                      }
                      return (
                        <li key={sub}>
                          <a
                            href={`${process.env.NEXT_PUBLIC_BASE_PATH}${link}`}
                            className={style}
                          >
                            {subs[sub].title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}
