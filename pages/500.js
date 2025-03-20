import dynamic from "next/dynamic";
const Error500 = dynamic(() => import("~/components/error/500"));

export default function Custom500() {
  return <Error500 />;
}

Custom500.hasError = true;
