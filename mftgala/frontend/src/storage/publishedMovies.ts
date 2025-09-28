// src/storage/moviesStore.ts

export interface PublishedMovie {
  id: number;                
  asaId: number;             
  movieName: string;
  studioName: string;
  imageUrl: string;
  trailerUrl: string;
  totalSupply: number;
  unitName: string;
  publisherAddress: string;
  description: string;
  genre: string;
  year?: string;
  director?: string;
  algoSeed: number;
  price: number;
}

let movies: PublishedMovie[] = [];

// Load movies from localStorage on initialization
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('publishedMovies');
  if (stored) {
    movies = JSON.parse(stored);
  }
}

// Save movie
export function saveMovie(movie: PublishedMovie): PublishedMovie {
  movies.push(movie);
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('publishedMovies', JSON.stringify(movies));
  }
  return movie;
}

// Get all movies
export function getMovies(): PublishedMovie[] {
  return movies;
}

// Get by ASA ID
export function getMovieByAsaId(asaId: number): PublishedMovie | undefined {
  return movies.find(m => m.asaId === asaId);
}
