import dynamic from "next/dynamic";
const Error404 = dynamic(() => import("~/components/error/404"));

export default function Custom404() {
  return <Error404 />;
}

Custom404.hasError = true;
