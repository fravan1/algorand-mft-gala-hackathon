'use client';

import { useState, useEffect } from 'react';
import styles from './Publish.module.css';
import Button from '@/components/ui/Button';
import { useWallet } from '@txnlab/use-wallet-react';
import { insertAsset } from '@/utils/appCall';
import { saveMovie, getMovies } from '@/storage/publishedMovies';

interface PublishFormData {
  movieName: string;
  studioName: string;
  imageUrl: string;
  trailerUrl: string;
  totalSupply: string;
  unitName: string;
  publisherAddress: string;
  description: string;
  genre: string;
  year: string;
  director: string;
}

export default function Publish() {
  const [formData, setFormData] = useState<PublishFormData>({
    movieName: '',
    studioName: '',
    imageUrl: '',
    trailerUrl: '',
    totalSupply: '',
    unitName: '',
    publisherAddress: '',
    description: '',
    genre: '',
    year: '',
    director: ''
  });

  const { activeAddress } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate publisher address when wallet is connected
  useEffect(() => {
    if (activeAddress) {
      setFormData(prev => ({
        ...prev,
        publisherAddress: activeAddress
      }));
    }
  }, [activeAddress]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Publishing movie with data:', formData);

      // Generate a random price for the asset
      const price = Math.floor(Math.random() * 1000000) + 100000;
      // Calculate algoSeed in microALGO
      const algoSeedInAlgo = Number(formData.totalSupply) * 0.2;
      const algoSeedInMicroAlgo = Math.floor(algoSeedInAlgo * 1_000_000);

      // Asset ID = length of published movies array
      const assetId = getMovies().length;

      const result = await insertAsset(
        assetId,
        Number(formData.totalSupply),
        price,
        formData.publisherAddress,
        algoSeedInMicroAlgo,
        formData.movieName,
        formData.unitName || "MFT",
      );

      if (result.success) {
        const saved = saveMovie({
          id: assetId,
          asaId: Number(result.createdAssetId),
          movieName: formData.movieName,
          studioName: formData.studioName,
          imageUrl: formData.imageUrl,
          trailerUrl: formData.trailerUrl,
          totalSupply: Number(formData.totalSupply),
          unitName: formData.unitName,
          publisherAddress: formData.publisherAddress,
          description: formData.description,
          genre: formData.genre,
          year: formData.year,
          director: formData.director,
          algoSeed: algoSeedInMicroAlgo,
          price: price
        });

        console.log('Saved movie:', saved);
        alert(`Movie published successfully! Asset ID: ${saved.id}`);
      } else {
        alert('Movie publish failed!');
      }

      // Reset form
      setFormData({
        movieName: '',
        studioName: '',
        imageUrl: '',
        trailerUrl: '',
        totalSupply: '',
        unitName: '',
        publisherAddress: '',
        description: '',
        genre: '',
        year: '',
        director: ''
      });
    } catch (error) {
      console.error('Error publishing movie:', error);
      alert('Error publishing movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.publishContainer}>
      <form onSubmit={handleSubmit} className={styles.publishForm}>
        <div className={styles.formGrid}>
          {/* Movie Preview Section */}
          <div className={styles.previewSection}>
            <div className={styles.moviePreview}>
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Movie poster"
                  className={styles.previewImage}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.jpg';
                  }}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>Movie Poster</span>
                </div>
              )}
              <div className={styles.previewInfo}>
                <h4>{formData.movieName || 'Movie Title'}</h4>
                <p>{formData.studioName || 'Studio Name'}</p>
                <p>{formData.description || 'Description'}</p>
              </div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="movieName">Movie Name *</label>
                <input
                  type="text"
                  id="movieName"
                  name="movieName"
                  value={formData.movieName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter movie title"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="studioName">Studio Name *</label>
                <input
                  type="text"
                  id="studioName"
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter studio name"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="genre">Genre *</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Animation">Animation</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="publisherAddress">Publisher Address *</label>
                <input
                  type="text"
                  id="publisherAddress"
                  name="publisherAddress"
                  value={formData.publisherAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter wallet address"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter movie description"
                rows={2}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">Image URL *</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="trailerUrl">Trailer URL</label>
                <input
                  type="url"
                  id="trailerUrl"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="totalSupply">Total Supply *</label>
                <input
                  type="number"
                  id="totalSupply"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  required
                  placeholder="1000"
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="unitName">Unit Name *</label>
                <input
                  type="text"
                  id="unitName"
                  name="unitName"
                  value={formData.unitName}
                  onChange={handleInputChange}
                  required
                  placeholder="MOVIE"
                  maxLength={8}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.submitSection}>
          <div className={styles.priceInfo}>
            <span className={styles.priceLabel}>Publishing Cost:</span>
            <span className={styles.priceValue}>
              {(() => {
                const totalSupply = parseFloat(formData.totalSupply) || 0;
                const cost = totalSupply * 0.2;
                return `${cost.toFixed(2)} ALGO`;
              })()}
            </span>
          </div>
          <Button
            variant="buy"
            className={styles.publishButton}
            type="submit"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Movie MFT'}
          </Button>
        </div>
      </form>
    </div>
  );
}
