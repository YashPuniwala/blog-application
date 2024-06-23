import React from "react";
import styles from "./resetPassword.module.css";
import ResetPasswordForm from "@/components/resetPasswordForm/resetPasswordForm";

const ResetPasswordPage = ({params}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ResetPasswordForm token={params.token}/>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
