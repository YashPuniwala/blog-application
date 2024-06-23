"use client"

import React, { useEffect } from "react";
import { forgotPassword } from "@/lib/action";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import styles from "./forgotPasswordForm.module.css"

const ForgotPassordForm = () => {
  const [state, formAction] = useFormState(forgotPassword, undefined);

  const router = useRouter();

  useEffect(() => {
    state?.success && router.push("/login");
  }, [state?.success, router]);

  return (
    <form action={formAction} className={styles.form}>
      <input type="text" placeholder="Email" name="email" />
      <button>Submit</button>
      {state?.error}
    </form>
  );
};

export default ForgotPassordForm;
