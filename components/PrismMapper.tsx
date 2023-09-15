import React, { useEffect, ReactNode } from "react";
import Prism from "prismjs";

interface PrismHighlightWrapperProps {
  children: ReactNode;
}

function PrismHighlightWrapper({
  children,
}: PrismHighlightWrapperProps): JSX.Element {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return <>{children}</>;
}

export default PrismHighlightWrapper;
