import { ReactElement } from "react";

interface WarnBoxProps {
  className?: string;
  children?: ReactElement;
}

const WarnBox: React.FC<WarnBoxProps> = (props: WarnBoxProps) => {
  return (
    <div
      className={`${[
        props.className ?? "",
      ]} rounded-lg bg-[#ff8c0020] border-[1px] border-[#ff8c00f1]`}
    >
      <div className="h-full flex items-center flex-col-reverse lg:items-start justify-between lg:flex-row ml-4 my-2 mr-4 gap-2">
        <span className="inline-block">{props.children}</span>
      </div>
    </div>
  );
};

export default WarnBox;
