import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import Navigation from "../Navigation/Navigation";


export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/">
            <img
              src="/blogg.jpg"
              alt="Blog logo"
              className={styles.bloggLogo}
            />
          </Link>
          <div className={styles.content}>
          <h1>Grupp 4 - Bloggen</h1>
          <Navigation />
         
          </div>
        </div>
      </header>
    </>
  );
}
