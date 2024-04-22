import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      
      <div className={styles.description}>
        
      <h3>Grupp 4 - Bloggen</h3>
        <p>Vi är en grupp bestående av Johan, Kristian och Sanna. 
          Vi har skapat en blogg där vi skriver om våra intressen och tankar.
           Välkommen!</p>
      </div>
    </main>
  );
}
