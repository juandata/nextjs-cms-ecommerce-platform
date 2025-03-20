import dynamic from "next/dynamic";
const SignIn = dynamic(() => import("~/components/Auth/signin"));

export default function SignInPage() {
  return <SignIn />;
}
