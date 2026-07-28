import { Origin } from "@/generated/prisma/client";
import { uploadImage } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";

type ImageUploadProps = {
  origin: Origin;
};

export default function ImageUpload({ origin }: ImageUploadProps) {
  const uploadToOrigin = uploadImage.bind(null, origin);

  return (
    <form action={uploadToOrigin} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.label}>Image</span>
        <input
          className={styles.fileInput}
          name="image"
          type="file"
          accept="image/*"
          required
        />
      </label>

      <p className={styles.hint}>
        Uploads are stored with the origin{" "}
        <code className={styles.code}>{origin.toLowerCase()}</code>. Maximum
        size: 10 MB.
      </p>

      <button className={styles.button} type="submit">
        Upload image
      </button>
    </form>
  );
}
