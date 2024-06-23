"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import styles from "./resetPassword.module.css";
import { resetPassword } from "@/lib/action";

const ResetPasswordForm = ({ token }) => {
  const [state, formAction] = useFormState(resetPassword, undefined);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/login");
    }
  }, [state?.success, router]);

  console.log(user, "user");
  console.log(token, "token");

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true); // Set loading to true when the request starts
      try {
        const response = await fetch("http://localhost:3000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          try {
            const data = await response.json();
            setUser(data);
            setSuccess(true);
            setError("");
          } catch (error) {
            console.error("Failed to parse JSON response:", error);
            setError("Failed to parse response!");
            setSuccess(false);
          }
        } else {
          try {
            const data = await response.json();
            setError(data.error || "Failed to reset password!");
            setSuccess(false);
          } catch (error) {
            console.error("Failed to parse JSON error response:", error);
            setError("Failed to reset password!");
            setSuccess(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch /api/user:", error);
        setError("Failed to reset password!");
        setSuccess(false);
      } finally {
        setLoading(false); // Set loading to false when the request ends
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError("");
      setSuccess(false);
    }
  }, [token]);

  return (
    <form className={styles.form} action={formAction}>
      <input type="password" placeholder="New Password" name="password" />
      <input type="password" placeholder="Confirm Password" name="confirmPassword" />
      <input type="hidden" name="token" value={token} />
      <button type="submit">Submit</button>
      {loading && <p>Loading...</p>} {/* Conditionally render loading text */}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>Password reset successfully!</p>}
      {/* {state?.error} */}
    </form>
  );
};

export default ResetPasswordForm;
