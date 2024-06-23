import React from "react";
import styles from "./forgotPassword.module.css";
import ForgotPasswordForm from "@/components/forgotPasswordForm/forgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;