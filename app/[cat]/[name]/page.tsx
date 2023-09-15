import SideBar from "@/components/sidebar";
import { DocPages, categories } from "@/components/pages/pages";
import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { cat, name },
}: Params): Promise<Metadata> {
  return {
    title: `${name} - ${cat}`,
  };
}

export default function DocPage({ params: { cat, name } }: Params) {
  cat = (cat as string).toLowerCase();
  name = (name as string).toLowerCase();
  const page = DocPages[cat]?.[name];
  const catTitle = categories[cat];
  if (!page) {
    notFound();
  }

  return (
    <main>
      <div className="container relative">
        <SideBar currentPage={page.link} />
        <div className="lg:pl-[12rem]">
          <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0">
            <header className="relative z-20">
              <div>
                <p className="mb-2 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400">
                  {catTitle}
                </p>
                <div className="flex items-center">
                  <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
                    {page.title}
                  </h1>
                </div>
                <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
                  {page.subtitle}
                </p>
              </div>
            </header>
            {page.content}
          </div>
        </div>
      </div>
    </main>
  );
}
