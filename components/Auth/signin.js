import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { formField } from "~/lib/clientFunctions";
import classes from "~/styles/signin.module.css";
import dynamic from "next/dynamic";
import {
  Facebook,
  Instagram,
  Person,
  Pinterest,
  Twitter,
  Youtube,
} from "@styled-icons/bootstrap";

const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const Link = dynamic(() => import("next/link"));

export default function SignIn({ popup, hidePopup }) {
  const [state, setState] = useState("");
  const router = useRouter();
  const settings = useSelector((state) => state.settings);
  const { data: session } = useSession();
  const { t } = useTranslation();
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };

  const { facebook, google } = settings.settingsData.login;

  async function signinProcess(e) {
    setState("loading");
    try {
      e.preventDefault();
      const { username, password } = formField(e.target.elements);
      const res = await signIn("credentials", {
        redirect: false,
        password,
        username,
      });
      if (res.error) {
        const errorMessage = res.error && (errors[res.error] ?? errors.default);
        toast.error(errorMessage);
      }
      if (res.ok) {
        toast.success("Login successful");
        if (popup) {
          hidePopup();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setState("");
  }

  useEffect(() => {
    if (session && !popup) {
      const url = session.user.a ? "/dashboard" : "/";
      router.push(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <HeadData title="Sign in" />
      <div className={classes.container}>
        <div className={classes.card}>
          <div className={classes.info}>
            <div className={classes.icon}>
              <Person width={60} height={60} />
            </div>
            <p>{settings.settingsData.description}</p>
            <div className={classes.social}>
              <a
                href={settings.settingsData.social.facebook}
                className={classes.social_icon}
                aria-label="Facebook"
              >
                <Facebook width={24} height={24} />
              </a>
              <a
                href={settings.settingsData.social.instagram}
                className={classes.social_icon}
                aria-label="Instagram"
              >
                <Instagram width={24} height={24} />
              </a>
              <a
                href={settings.settingsData.social.twitter}
                className={classes.social_icon}
                aria-label="Twitter"
              >
                <Twitter width={24} height={24} />
              </a>
              <a
                href={settings.settingsData.social.youtube}
                className={classes.social_icon}
                aria-label="Youtube"
              >
                <Youtube width={24} height={24} />
              </a>
              <a
                href={settings.settingsData.social.pinterest}
                className={classes.social_icon}
                aria-label="Pinterest"
              >
                <Pinterest width={24} height={24} />
              </a>
            </div>
          </div>
          <div className={classes.form_container}>
            <h1>{t("signin")}</h1>
            <form className={classes.form} onSubmit={signinProcess}>
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder={t("email")}
                required
              />
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder={t("password")}
                required
              />
              <div className={classes.reset_link}>
                <Link href="/reset">{t("forget_your_password?")}</Link> |
                <Link href="/signup"> {t("create_an_account!")}</Link>
              </div>
              <LoadingButton text={t("signin")} type="submit" state={state} />
            </form>
            {(facebook || google) && <span className={classes.hr} />}
            <div>
              {facebook && (
                <button
                  variant="outline"
                  onClick={async () => await signIn("facebook")}
                  className={classes.facebook}
                >
                  {t("signin_with_facebook")}
                </button>
              )}
              {google && (
                <button
                  variant="outline"
                  onClick={async () => await signIn("google")}
                  className={classes.google}
                >
                  {t("signin_with_google")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
