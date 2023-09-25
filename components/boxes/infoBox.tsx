import { ReactElement } from "react";

interface InfoBoxProps {
  className?: string;
  children: ReactElement;
  nextable?: boolean;
  onNext?: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = (props: InfoBoxProps) => {
  return (
    <div
      className={`${[
        props.className ?? "",
      ]} w-full rounded-lg bg-[#00ff0020] border-[1px] border-[#00ff0060]`}
    >
      <div className="h-full flex items-center flex-col-reverse lg:items-start justify-between lg:flex-row ml-10 my-2 mr-4 gap-2">
        <span className="inline-block">{props.children}</span>
        {props.nextable && (
          <button
            type="button"
            onClick={props.onNext}
            className="not-prose relative flex-none text-sm text-center font-semibold text-white py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-sky-500 dark:text-white focus:outline-none hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:highlight-white/20 dark:hover:bg-sky-400 dark:focus:ring-2 dark:focus:ring-sky-600 dark:focus:ring-offset-slate-900"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoBox;
