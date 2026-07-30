import Link from "next/link";
import { Origin } from "@/generated/prisma/client";
import ImageUpload from "@/components/admin/image-upload";
import { logout } from "../actions";
import { createJournalEntry } from "../actions";
import { requireAdmin } from "@/lib/auth/admin";
import styles from "../admin.module.css";

const notices: Record<string, string> = {
  "image-uploaded": "Image uploaded.",
  "journal-created": "Journal entry created.",
};

const errors: Record<string, string> = {
  "invalid-origin": "That upload destination is not allowed.",
  "missing-image": "Choose an image to upload.",
  "invalid-image": "The selected file must be an image.",
  "image-too-large": "The image must be 10 MB or smaller.",
  "upload-failed": "The image could not be uploaded.",
  "database-write-failed": "The database write failed. Please try again.",
  "missing-journal-fields": "Fill in the title, description, and entry content.",
};

type AdminPageProps = {
  searchParams: Promise<{
    tab?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const activeTab = params.tab === "journal" ? "journal" : "gallery";
  const notice = params.success ? notices[params.success] : null;
  const error = params.error ? errors[params.error] : null;

  return (
    <main className={styles.page}>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administrator</p>
            <h1 className={styles.title}>Content</h1>
          </div>

          <form action={logout}>
            <button className={styles.compactButton} type="submit">
              Sign out
            </button>
          </form>
        </header>

        <div className={styles.status}>
          <span className={styles.statusDot} aria-hidden="true" />
          Signed in{admin.email ? ` as ${admin.email}` : ""}
        </div>

        <nav className={styles.tabs} aria-label="Admin content sections">
          <Link
            className={activeTab === "gallery" ? styles.activeTab : styles.tab}
            href="/admin?tab=gallery"
          >
            Gallery
          </Link>
          <Link
            className={activeTab === "journal" ? styles.activeTab : styles.tab}
            href="/admin?tab=journal"
          >
            Journal
          </Link>
        </nav>

        {notice ? (
          <p className={styles.success} role="status">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <section className={styles.panel}>
          {activeTab === "gallery" ? (
            <>
              <h2 className={styles.sectionTitle}>Gallery image</h2>
              <ImageUpload origin={Origin.GALLERY} />
            </>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>New journal entry</h2>
              <form action={createJournalEntry} className={styles.form}>
                <label className={styles.field}>
                  <span className={styles.label}>Title</span>
                  <input
                    className={styles.input}
                    name="title"
                    type="text"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Description</span>
                  <input
                    className={styles.input}
                    name="description"
                    type="text"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Entry content</span>
                  <textarea
                    className={styles.textarea}
                    name="content"
                    rows={10}
                    required
                  />
                </label>

                <label className={styles.checkboxField}>
                  <input name="pinned" type="checkbox" />
                  <span>Pin this entry</span>
                </label>

                <button className={styles.button} type="submit">
                  Create entry
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
