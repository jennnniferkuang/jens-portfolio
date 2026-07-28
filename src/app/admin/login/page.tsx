import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { login } from "../actions";
import styles from "../admin.module.css";

const errorMessages: Record<string, string> = {
  missing: "Enter both your email and password.",
  invalid: "The email or password is incorrect.",
  unauthorized: "This account is not authorized to access the admin area.",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  const admin = await getAdminSession();

  if (admin) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : null;

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Private access</p>
        <h1 className={styles.title}>Admin login</h1>
        <p className={styles.copy}>
          Sign in with your site administrator account.
        </p>

        {errorMessage ? (
          <p className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form action={login} className={styles.form}>
          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              className={styles.input}
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className={styles.button} type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
