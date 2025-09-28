"use client"

import { useState, useMemo, useEffect } from 'react';
import styles from './Marketplace.module.css';
import Card from '@/components/ui/Card';
import { Movie } from '@/types/movie';
import moviesData from '@/data/movies.json';
import Button from '@/components/ui/Button';
import { getAssetInfo } from '@/utils/appCall';

interface AssetPriceInfo {
    price: bigint;
    algoLiquidity: bigint;
    tokenLiquidity: bigint;
    totalSupply: bigint;
    creator: string;
    asaId: bigint;
    hypeFactor: bigint;
    lastStreamValue: bigint;
    lastUpdateRound: bigint;
}

export default function Marketplace() {
    const movies: Movie[] = moviesData as Movie[];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [assetPrices, setAssetPrices] = useState<Record<number, AssetPriceInfo>>({});
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);

    // Fetch price info for all movies
    /*useEffect(() => {
        const fetchAllAssetPrices = async () => {
            setLoadingPrices(true);
            setPriceError(null);
            
            try {
                const pricePromises = movies.map(async (movie) => {
                    try {
                        const assetInfo = await getAssetInfo(movie.id);
                        return { id: movie.id, info: assetInfo };
                    } catch (error) {
                        console.warn(`Failed to fetch price for movie ${movie.id}:`, error);
                        return { id: movie.id, info: null };
                    }
                });

                const results = await Promise.all(pricePromises);
                const priceMap: Record<number, AssetPriceInfo> = {};
                
                results.forEach(({ id, info }) => {
                    if (info) {
                        priceMap[id] = info;
                    }
                });
                
                setAssetPrices(priceMap);
            } catch (error) {
                console.error('Error fetching asset prices:', error);
                setPriceError('Failed to load price information');
            } finally {
                setLoadingPrices(false);
            }
        };

        fetchAllAssetPrices();
    }, [movies]);*/
    // Get unique genres for filter
    const genres = useMemo(() => {
        const uniqueGenres = [...new Set(movies.map(movie => movie.genre))];
        return uniqueGenres;
    }, [movies]);
    
    // Filter movies based on search and filters
    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                movie.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
            const matchesPrice = !priceRange || (
                priceRange === 'low' && parseFloat(movie.price) <= 0.6 ||
                priceRange === 'medium' && parseFloat(movie.price) > 0.6 && parseFloat(movie.price) <= 0.9 ||
                priceRange === 'high' && parseFloat(movie.price) > 0.9
            );
            
            return matchesSearch && matchesGenre && matchesPrice;
        });
    }, [movies, searchTerm, selectedGenre, priceRange]);
    
    const handleMovieClick = (movieId: number) => {
        console.log(`Clicked on movie ${movieId}`);
        window.location.href = `/marketplace/${movieId}`;
    };

    return(
        <div className={styles.marketplaceContainer}>
            
            {/* Search and Filter Section */}
            <div className={styles.searchFilterSection}>
                <div className={styles.filters}>
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>
                    
                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">All Prices</option>
                        <option value="low">Low (≤ 0.6 ALGO)</option>
                        <option value="medium">Medium (0.6-0.9 ALGO)</option>
                        <option value="high">High (&gt; 0.9 ALGO)</option>
                    </select>
                </div>
                
                <div className={styles.searchBar}>
                    <div className={styles.searchInputContainer}>
                        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </div>
            
            <div className={styles.marketPlaceMainContent}>
                {loadingPrices && (
                    <div className={styles.loadingIndicator}>
                        <p>Loading price information...</p>
                    </div>
                )}
                
                {priceError && (
                    <div className={styles.errorMessage}>
                        <p>⚠️ {priceError}</p>
                    </div>
                )}

                {filteredMovies.map((movie) => {
                    const assetInfo = assetPrices[movie.id];
                    const currentPrice = assetInfo ? Number(assetInfo.price) / 1000000 : parseFloat(movie.price);
                    const liquidity = assetInfo ? Number(assetInfo.algoLiquidity) / 1000000 : 0;
                    const hypeFactor = assetInfo ? Number(assetInfo.hypeFactor) : 1;
                    
                    return (
                        <Card 
                            key={movie.id}
                            className={styles.movieCard} 
                            hoverable={true}
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <div className={styles.movieImage}>
                                <img src={movie.image} alt={movie.title} />
                            </div>
                            <div className={styles.movieInfo}>
                                <h3 className={styles.movieTitle}>{movie.title}</h3>
                                <p className={styles.movieDescription}>{movie.desc}</p>
                                
                                {/* Price Information */}
                                <div className={styles.priceInfo}>
                                    <div className={styles.moviePrice}>
                                        {assetInfo ? (
                                            <>
                                                <span className={styles.currentPrice}>
                                                    {currentPrice.toFixed(6)} ALGO
                                                </span>
                                                <span className={styles.originalPrice}>
                                                    (Original: {movie.price} {movie.unit_name})
                                                </span>
                                            </>
                                        ) : (
                                            <span>{movie.price} {movie.unit_name}</span>
                                        )}
                                    </div>
                                    
                                    {assetInfo && (
                                        <div className={styles.assetDetails}>
                                            <div className={styles.liquidity}>
                                                💧 Liquidity: {liquidity.toFixed(2)} ALGO
                                            </div>
                                            <div className={styles.hypeFactor}>
                                                🔥 Hype: {hypeFactor}x
                                            </div>
                                            <div className={styles.supply}>
                                                📊 Supply: {Number(assetInfo.totalSupply).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row gap-1 justify-center items-center">
                                <Button variant="buy">Buy</Button>
                                <Button variant="sell">Sell</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
} 