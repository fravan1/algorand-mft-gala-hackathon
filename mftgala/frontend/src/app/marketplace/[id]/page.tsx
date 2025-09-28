"use client"

import styles from './Movie.module.css';
import Image from 'next/image';
import { getMovies as getPublishedMovies } from '@/storage/publishedMovies';
import { PublishedMovie } from '@/storage/publishedMovies';
import { useState, use, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import PriceChart from '../../../components/ui/PriceChart';
import { buyAsset, sellAsset, checkAssetExists, getAssetInfo } from '@/utils/appCall';
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
    const [movie, setMovie] = useState<PublishedMovie | undefined>();
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [priceError, setPriceError] = useState<string | null>(null);
    const { activeAddress } = useWallet();

    // Load movie from published movies storage
    useEffect(() => {
        const publishedMovies = getPublishedMovies();
        console.log('Published movies:', publishedMovies);
        console.log('Looking for movie with ID:', parseInt(id));
        const foundMovie = publishedMovies.find((m: PublishedMovie) => m.id === parseInt(id));
        console.log('Found movie:', foundMovie);
        setMovie(foundMovie);
    }, [id]);

    // Fetch current price from blockchain
    useEffect(() => {
        const fetchCurrentPrice = async () => {
            if (!movie) return;
            
            try {
                const assetInfo = await getAssetInfo(movie.id);
                const priceInAlgo = Number(assetInfo.price) / 1_000_000; // Convert microALGO to ALGO
                setCurrentPrice(priceInAlgo);
                setPriceError(null);
            } catch (error) {
                console.error('Error fetching current price:', error);
                setPriceError('Failed to load current price');
                // Fallback to stored price
                setCurrentPrice(movie.price);
            }
        };

        if (movie) {
            fetchCurrentPrice(); 
        }
    }, [movie]);

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

                const paymentInAlgo = Number(amount) * currentPrice;
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
        { time: '24:00', price: currentPrice || 0.5, color: (currentPrice || 0.5) >= 1 ? '#10b981' : '#ef4444' }
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
                            src={movie.imageUrl} 
                            alt={movie.movieName} 
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
                        <h1 className={styles.movieTitle}>{movie.movieName}</h1>
                        <p className={styles.movieDetail}>Director: {movie.director || 'N/A'}</p>
                        <p className={styles.movieDetail}>Year: {movie.year || 'N/A'}</p>
                        <p className={styles.movieDetail}>Genre: {movie.genre}</p>
                        <p className={styles.movieDetail}>Studio: {movie.studioName}</p>
                        <p className={styles.moviePrice}>
                            Price: {priceError ? `${movie.price} ALGO (fallback)` : `${currentPrice.toFixed(4)} ALGO`}
                        </p>
                        <p className={styles.movieDescription}>{movie.description}</p>
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
                                    <div className={styles.priceValue}>
                                        {priceError ? `${movie.price} ALGO (fallback)` : `${currentPrice.toFixed(4)} ALGO`}
                                    </div>
                                </div>
                                
                                <div className={styles.priceInfo}>
                                    <div className={styles.priceLabel}>
                                        Total {activeTab === 'buy' ? 'Cost' : 'Value'}
                                    </div>
                                    <div className={styles.priceValue}>
                                        {amount ? (parseFloat(amount) * currentPrice).toFixed(4) : '0.0000'} ALGO
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
                            {movie.movieName} - Trailer
                        </h2>
                        <div className={styles.trailerVideo}>
                            {(() => {
                                // Extract video ID from various YouTube URL formats
                                const getVideoId = (url: string) => {
                                    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
                                    return match ? match[1] : null;
                                };
                                
                                const videoId = getVideoId(movie.trailerUrl);
                                
                                if (videoId) {
                                    return (
                                        <iframe
                                            width="100%"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                            title={`${movie.movieName} Trailer`}
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
                                                    Unable to load trailer for {movie.movieName}
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