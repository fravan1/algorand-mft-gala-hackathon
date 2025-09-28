"use client"

import { useRouter } from 'next/navigation';
import styles from './Home.module.css';

export default function Home() {

  const router = useRouter();
  
  const handleHiwButton = () => {
    router.push('/howitworks');
  }

  const handleCtaButton = () => {
    router.push('/marketplace');
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>First Of Its Kind Movie Marketplace</h1>
        <div className={styles.heroDescription}>
          MFT-Gala is the first movie marketplace where fans can own a piece of the films they love. Every movie is represented as a tradeable Algorand Standard Asset (ASA), allowing you to buy, sell, and earn royalties as the film succeeds. Powered by a dynamic bonding curve, MFTGala adjusts token prices based on demand and popularity, turning your movie shares into real DeFi assets. Invest early, trade freely, and earn passive rewards because in MFT-Gala, your fandom pays off.
        </div>
        <div className={styles.heroButtonsContainer}>
          <button className={styles.ctaButton} onClick={handleCtaButton}>Get Started</button>
          <button className={styles.hiwButton} onClick={handleHiwButton}>How it works?</button>  
        </div>
      </div>
    </div>
  );
}
