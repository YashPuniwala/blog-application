"use client"

import Link from "next/link";
import React, { useEffect } from "react";
import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";
import { login } from "@/lib/action";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [state, formState] = useFormState(login, undefined);

  const router = useRouter();

  useEffect(() => {
    state?.success && router.push("/");
  }, [state?.success, router]);

  return (
    <form className={styles.form} action={formState}>
      <input type="text" placeholder="username" name="username" />
      <input type="password" placeholder="password" name="password" />
      <button>Login</button>
      {state?.error}
      <Link href="/forgotPassword">Forgot Password?</Link>
      <Link href="/register">
        {"Don't have an account?"} <b>Register</b>
      </Link>
    </form>
  );
};

export default LoginForm;
