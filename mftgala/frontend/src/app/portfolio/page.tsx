'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@txnlab/use-wallet-react';
import styles from './Portfolio.module.css';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PieChart from '../../components/ui/PieChart';
import { Movie } from '../../types/movie';
import moviesData from '../../data/movies.json';

export default function Portfolio() {
    const [currency, setCurrency] = useState<'ALGO' | 'USDC'>('ALGO');
    const [copied, setCopied] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const router = useRouter();
    const { wallets, activeAddress } = useWallet();
    
    // Mock wallet address
    const walletAddress = activeAddress || 'G4RZTA4APLTKOPNCSXZL6MHOYMXMMCXGWDQTESRM7QR44ZCKSLNRBVZWJY';
    
    // Mock portfolio data
    const portfolioValue = currency === 'ALGO' ? '1,250.50' : '2,847.32';
    const portfolioChange = '+12.5%';
    const ownedMovies = moviesData.slice(0, 10) as Movie[];
    
    // Pie chart data for portfolio distribution
    const pieChartData = [
        { label: 'Action Movies', value: 450, color: '#3B82F6' },
        { label: 'Comedy Movies', value: 320, color: '#10B981' },
        { label: 'Drama Movies', value: 280, color: '#F59E0B' },
        { label: 'Sci-Fi Movies', value: 200, color: '#EF4444' },
        { label: 'Other Genres', value: 150, color: '#8B5CF6' }
    ];
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            if (wallets) {
                const activeWallet = wallets.find((w) => w.isActive);
                if (activeWallet) {
                    await activeWallet.disconnect();
                } else {
                    localStorage.removeItem('@txnlab/use-wallet:v3');
                }
            }
            // Navigate to home page after disconnection
            router.push('/');
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <div className={styles.portfolioContainer}>
            <div className={styles.overviewSection}>
                <Card className={styles.walletCard}>
                    <div className={styles.walletInfo}>
                        <div className={styles.addressSection}>
                            <h3 className={styles.sectionTitle}>Wallet Address</h3>
                            <div className={styles.addressContainer}>
                                <span className={styles.address}>{walletAddress}</span>
                                <button 
                                    className={styles.copyButton}
                                    onClick={copyToClipboard}
                                    title="Copy full address"
                                >
                                    {copied ? '✓' : '📋'}
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.valueSection}>
                            <h3 className={styles.sectionTitle}>Portfolio Value</h3>
                            <div className={styles.valueContainer}>
                                <div className={styles.valueInfo}>
                                    <span className={styles.value}>{portfolioValue}</span>
                                    <span className={styles.currency}>{currency}</span>
                                    <span className={styles.change}>{portfolioChange}</span>
                                </div>
                                <div className={styles.currencyToggle}>
                                    <button 
                                        className={`${styles.toggleButton} ${currency === 'ALGO' ? styles.active : ''}`}
                                        onClick={() => setCurrency('ALGO')}
                                    >
                                        ALGO
                                    </button>
                                    <button 
                                        className={`${styles.toggleButton} ${currency === 'USDC' ? styles.active : ''}`}
                                        onClick={() => setCurrency('USDC')}
                                    >
                                        USDC
                                    </button>
                                </div>
                            </div>
                            <div className={styles.disconnectSection}>
                                <Button 
                                    variant="buy"
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                >
                                    {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.collectionSection}>
                    <div className={styles.holdingsList}>
                        {ownedMovies.map((movie) => (
                            <Card key={movie.id} className={styles.holdingItem}>
                                <div className={styles.holdingInfo}>
                                    <div className={styles.unitName}>
                                        <h3 className={styles.holdingTitle}>{movie.title}</h3>
                                        <p className={styles.holdingGenre}>{movie.genre}</p>
                                    </div>
                                    
                                    <div className={styles.holdingAmount}>
                                        <span className={styles.amountLabel}>Amount</span>
                                        <span className={styles.amountValue}>5 {movie.unit_name}</span>
                                    </div>
                                    
                                    <div className={styles.holdingPrice}>
                                        <span className={styles.priceLabel}>Price</span>
                                        <span className={styles.priceValue}>
                                            {currency === 'ALGO' ? '45.2 ALGO' : '102.5 USDC'}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.holdingTotal}>
                                        <span className={styles.totalLabel}>Total Value</span>
                                        <span className={styles.totalValue}>
                                            {currency === 'ALGO' ? '226.0 ALGO' : '512.5 USDC'}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.holdingChange}>
                                        <span className={styles.changeLabel}>24h Change</span>
                                        <span className={styles.changeValue}>+12.5%</span>
                                    </div>
                                    
                                    <div className={styles.holdingActions}>
                                        <Button variant="buy" className={styles.claimButton}>
                                            Claim
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className={styles.statsSection}>
                    <Card className={styles.statsCard}>
                        <div className={styles.statsContent}>
                            <h3 className={styles.statsTitle}>Portfolio Distribution</h3>
                            <PieChart 
                                data={pieChartData}
                                size={250}
                                showLegend={true}
                                className={styles.portfolioChart}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}