import { logout } from "../actions";
import { requireAdmin } from "@/lib/auth/admin";
import styles from "../admin.module.css";

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Administrator</p>
        <h1 className={styles.title}>Welcome back.</h1>
        <p className={styles.copy}>
          This private page is ready for your future journal, image, and site
          management tools.
        </p>

        <div className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Signed in{admin.email ? ` as ${admin.email}` : ""}
        </div>

        <form action={logout}>
          <button className={styles.secondaryButton} type="submit">
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}
