"use client"

import styles from './Movie.module.css';
import Image from 'next/image';
import moviesData from '../../../data/movies.json';
import { Movie as MovieType } from '../../../types/movie';
import { useState, use, act } from 'react';
import Button from '../../../components/ui/Button';
import PriceChart from '../../../components/ui/PriceChart';
import { buyAsset, sellAsset, checkAssetExists } from '@/utils/appCall';
import { useWallet } from '@txnlab/use-wallet-react';

interface MoviePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function Movie({ params }: MoviePageProps) {
    const { id } = use(params);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [amount, setAmount] = useState('');
    const { activeAddress } = useWallet();
    const movie: MovieType | undefined = moviesData.find((m: MovieType) => m.id === parseInt(id));

    const handleBuySell = async () => {
        if (!activeAddress) {
            alert('Please connect your wallet first');
            return;
        }

        if (!amount || Number(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            if (activeTab === 'buy') {
                // Check if asset exists in marketplace first
                const assetExists = await checkAssetExists(Number(id));
                if (!assetExists) {
                    alert(`Asset ${id} does not exist in the marketplace. Please ensure the asset has been inserted first using the Publish page.`);
                    return;
                }

                const paymentInAlgo = Number(amount) * parseFloat(movie!.price.split(' ')[0]);
                const paymentInMicroAlgo = Math.floor(paymentInAlgo * 1000000);
                
                console.log('Buying asset with params:', {
                    assetId: Number(id),
                    amount: Number(amount),
                    buyer: activeAddress,
                    payment: paymentInMicroAlgo,
                    paymentInAlgo: paymentInAlgo
                });

                const result = await buyAsset(Number(id), Number(amount), activeAddress, paymentInMicroAlgo);
                console.log('Buy result:', result);
                
                if (result) {
                    alert('Asset purchased successfully!');
                } else {
                    alert('Failed to purchase asset. Please check your balance and try again.');
                }
            } else {
                console.log('Selling asset with params:', {
                    assetId: Number(id),
                    amount: Number(amount),
                    seller: activeAddress
                });

                const result = await sellAsset(Number(id), Number(amount), activeAddress);
                console.log('Sell result:', result);
                
                if (result) {
                    alert('Asset sold successfully!');
                } else {
                    alert('Failed to sell asset. Please check your balance and try again.');
                }
            }
        } catch (error) {
            console.error('Transaction error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Transaction failed: ${errorMessage}`);
        }
    }
    // Mock price data for the chart with conditional coloring
    const priceData = [
        { time: '00:00', price: 0.45, color: '#ef4444' },
        { time: '04:00', price: 0.52, color: '#ef4444' },
        { time: '08:00', price: 0.48, color: '#ef4444' },
        { time: '12:00', price: 0.55, color: '#ef4444' },
        { time: '16:00', price: 1.58, color: '#10b981' },
        { time: '20:00', price: 1.62, color: '#10b981' },
        { time: '24:00', price: parseFloat(movie?.price.split(' ')[0] || '0.5'), color: parseFloat(movie?.price.split(' ')[0] || '0.5') >= 1 ? '#10b981' : '#ef4444' }
    ];
    
    if (!movie) {
        return (
            <div className={styles.movieContainer}>
                <div className={styles.movieContent}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Movie not found</h1>
                </div>
            </div>
        );
    }

    
    return(
        <div className={styles.movieContainer}>
            <div className={styles.movieContent}>
                <div className={styles.movieMainContent}>
                    <div className={styles.imageContainer}>
                        <Image 
                            src={movie.image} 
                            alt={movie.title} 
                            width={300} 
                            height={400} 
                            className={styles.movieImage}
                        />
                        <button
                            onClick={() => setIsTrailerOpen(true)}
                            className={styles.trailerButton}
                            title="Watch Trailer"
                        >
                            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                    </div>
                    <div className={styles.movieInfo}>
                        <h1 className={styles.movieTitle}>{movie.title}</h1>
                        <p className={styles.movieDetail}>Director: {movie.director}</p>
                        <p className={styles.movieDetail}>Year: {movie.year}</p>
                        <p className={styles.movieDetail}>Genre: {movie.genre}</p>
                        <p className={styles.movieDetail}>Rating: {movie.rating}/10</p>
                        <p className={styles.moviePrice}>Price: {movie.price}</p>
                        <p className={styles.movieDescription}>{movie.desc}</p>
                    </div>
                    
                    <div className={styles.buySellSection}>
                        <div className={styles.buySellContent}>
                            <div className={styles.buySellForm}>
                                <div className={styles.buySellTabs}>
                                    <button
                                        className={`${styles.tabButtonBuy} ${activeTab === 'buy' ? styles.active : ''}`}
                                        onClick={() => setActiveTab('buy')}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        className={`${styles.tabButtonSell} ${activeTab === 'sell' ? styles.active : ''}`}
                                        onClick={() => setActiveTab('sell')}
                                    >
                                        Sell
                                    </button>
                                </div>
                                
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={styles.amountInput}
                                    min="0"
                                    step="0.01"
                                />
                                
                                <div className={styles.priceInfo}>
                                    <div className={styles.priceLabel}>Price per share</div>
                                    <div className={styles.priceValue}>{movie.price}</div>
                                </div>
                                
                                <div className={styles.priceInfo}>
                                    <div className={styles.priceLabel}>
                                        Total {activeTab === 'buy' ? 'Cost' : 'Value'}
                                    </div>
                                    <div className={styles.priceValue}>
                                        {amount ? (parseFloat(amount) * parseFloat(movie.price.split(' ')[0])).toFixed(2) : '0.00'} ALGO
                                    </div>
                                </div>
                                
                                <Button
                                    variant={activeTab}
                                    onClick={handleBuySell}
                                    className={styles.actionButton}
                                >
                                    {activeTab === 'buy' ? 'Buy Shares' : 'Sell Shares'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.movieGraphContent}>
                    <div style={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333', 
                        borderRadius: '0.5rem', 
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: 'white'
                    }}>
                        <PriceChart data={priceData} />
                    </div>
                </div>
            </div>
            
            {/* Trailer Modal */}
            {isTrailerOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            onClick={() => setIsTrailerOpen(false)}
                            className={styles.modalCloseButton}
                        >
                            ×
                        </button>
                        <h2 className={styles.modalTitle}>
                            {movie.title} - Trailer
                        </h2>
                        <div className={styles.trailerVideo}>
                            {(() => {
                                // Extract video ID from various YouTube URL formats
                                const getVideoId = (url: string) => {
                                    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                                    return match ? match[1] : null;
                                };
                                
                                const videoId = getVideoId(movie.trailer);
                                
                                if (videoId) {
                                    return (
                                        <iframe
                                            width="100%"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                            title={`${movie.title} Trailer`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    );
                                } else {
                                    return (
                                        <div className={styles.trailerPlaceholder}>
                                            <div className={styles.placeholderContent}>
                                                <svg className={styles.placeholderIcon} fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                                <p className={styles.placeholderText}>Trailer not available</p>
                                                <p className={styles.placeholderSubtext}>
                                                    Unable to load trailer for {movie.title}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setIsTrailerOpen(false)}
                                className={styles.closeButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}