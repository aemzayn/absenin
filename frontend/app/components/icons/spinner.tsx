import { AiOutlineLoading3Quarters } from "react-icons/ai";
import type { IconType } from "react-icons/lib";

export const Spinner = (props?: Partial<IconType>) => {
  return <AiOutlineLoading3Quarters {...props} className="spin" />;
};
