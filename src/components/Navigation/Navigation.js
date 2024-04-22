import styles from "./Navigation.module.css";
import Link from "next/link";
export default function Navigation() {
  return (
    <>
      <nav className={styles.link}>
        <Link href="/">Home</Link>
        <Link href="/"> ➕ Add blog post</Link>
        <Link href="/">All posts</Link>
      </nav>
    </>
  );
}
