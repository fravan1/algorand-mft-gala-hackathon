import styles from './HowItWorks.module.css';

export default function HowItWorks() {
    return(
        <div className={styles.howItWorksContainer}>
            <div className={styles.howItWorksSection}>
                <h2 className={styles.sectionTitle}>How It Works</h2>
                <div className={styles.stepsContainer}>
                <div className={styles.step}>
                    <span className={styles.stepNumber}>1</span>
                    <span className={styles.stepText}>Buy Movie Shares</span>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <span className={styles.stepText}>Sell Movie Shares</span>
                </div>
                <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <span className={styles.stepText}>Earn Royalties</span>
                </div>
                </div>
            </div>
        </div>
    )
}