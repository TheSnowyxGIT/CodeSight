"use client";
import StarsCollide from "@/components/stars-collide";
import { Tally1Icon, Tally2Icon } from "lucide-react";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { useRouter } from "next/navigation";
import { DocPages, categories } from "@/components/pages/pages";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div className="w-full h-[calc(100vh-56px)]">
        <div className="h-full w-full relative flex justify-center items-center">
          <StarsCollide className="fixed top-0 bottom-0 left-0 right-0 z-0" />
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/code-sight-logo.png`}
                alt="Logo"
                width={200}
                height={200}
                className="lg:h-[200px] lg:w-[200px] h-[100px] w-[100px]"
              />
              <h1
                className={`text-foreground ml-4 text-5xl lg:text-7xl ${pacifico.className}`}
              >
                CodeSight
              </h1>
            </div>
            <h2
              className={`text-foreground text-2xl my-4 ${pacifico.className} text-center`}
            >
              Algorithms Visualizer Demo WebSite
            </h2>
            <a
              href="#table-of-content"
              className="relative flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
            >
              Get Started
            </a>
          </div>
        </div>
        <div
          id="table-of-content"
          className="w-full relative pb-8 bg-[#121723] min-h-[700px]"
        >
          <div className="container">
            <div className="flex flex-col pt-8 ">
              <h2 className="text-foreground text-2xl">Algorithms</h2>
              <span className="text-sky-500 text-sm">
                Choose the algorithm you want to visualize..
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:justify-items-center py-12">
              {Object.keys(categories).map((category) => {
                const categoryTitle = categories[category];
                return (
                  <div
                    key={category}
                    className="bg-white bg-opacity-10 w-full p-10 rounded-lg"
                  >
                    <div className="flex items-center m-4">
                      <Tally1Icon className="mr-2 h-8 w-8" />
                      <h3 className="text-xl">{categoryTitle}</h3>
                    </div>
                    <nav className="ml-[4rem]">
                      <ul>
                        {Object.keys(DocPages[category]).map((pageName) => {
                          const page = DocPages[category][pageName];
                          return (
                            <li key={pageName} className="mt-1">
                              <a
                                href={`${process.env.NEXT_PUBLIC_BASE_PATH}${page.link}`}
                                className="block border-l pl-4 border-slate-500 hover:border-slate-400 text-muted-foreground hover:text-foreground"
                              >
                                {page.title}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="footer py-20 bg-transparent relative">
          <div className="flex flex-col justify-center items-center mt-6 z-10">
            <span className="text-slate-400">Made by</span>
            <span className={`text-foreground text-2xl ${pacifico.className}`}>
              Adrien Pingard
            </span>
          </div>
          <div className="flex justify-center items-center mt-4 gap-4">
            <a
              href="https://www.linkedin.com/in/adrien-pingard/"
              className="relative flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
            >
              Personal Portfolio
            </a>
            <SocialIcon
              url="www.github.com"
              onClick={() => {
                router.push("https://github.com/TheSnowyxGIT");
              }}
            />
            <SocialIcon
              url="www.linkedin.com"
              onClick={() => {
                router.push("https://www.linkedin.com/in/adrien-pingard/");
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
