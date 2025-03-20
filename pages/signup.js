import dynamic from "next/dynamic";
const SignUp = dynamic(() => import("~/components/Auth/signup"));

export default function SignUpPage() {
  return <SignUp />;
}
