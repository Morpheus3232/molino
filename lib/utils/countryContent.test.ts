import { describe, it, expect } from 'vitest';
import { 
  getCountryContent, 
  getFamousPeopleByCountry, 
  getMoviesByCountry, 
  getBrandsByCountry, 
  getCountryStats,
  getAvailableCountries,
  getCountryFamousByAnimal,
  getCountryMoviesByAnimal,
  getCountryBrandsByAnimal 
} from "./countryContent";

describe('Country Content Utility', () => {
  it('should return content for Argentina', () => {
    const content = getCountryContent('Argentina');
    expect(content.country).toBe('Argentina');
    expect(content.famousPeople.length).toBeGreaterThan(0);
    expect(content.movies.length).toBeGreaterThan(0);
    expect(content.brands.length).toBeGreaterThan(0);
    expect(content.entities.length).toBeGreaterThan(0);
  });

  it('should return famous people for Argentina', () => {
    const people = getFamousPeopleByCountry('Argentina');
    expect(people.length).toBeGreaterThan(0);
    const argPeople = people.filter(p => p.country.toLowerCase() === 'argentina');
    expect(argPeople.length).toBe(people.length);
  });

  it('should return movies for Argentina', () => {
    const movies = getMoviesByCountry('Argentina');
    expect(movies.length).toBeGreaterThan(0);
    movies.forEach(m => {
      expect(m.country.toLowerCase()).toBe('argentina');
    });
  });

  it('should return brands for Argentina', () => {
    const brands = getBrandsByCountry('Argentina');
    expect(brands.length).toBeGreaterThan(0);
    brands.forEach(b => {
      expect(b.country.toLowerCase()).toBe('argentina');
    });
  });

  it('should return stats for Argentina', () => {
    const stats = getCountryStats('Argentina');
    expect(stats.famousPeopleCount).toBeGreaterThan(0);
    expect(stats.moviesCount).toBeGreaterThan(0);
    expect(stats.brandsCount).toBeGreaterThan(0);
    expect(stats.entitiesCount).toBeGreaterThan(0);
  });

  it('should return available countries', () => {
    const countries = getAvailableCountries();
    expect(countries.length).toBeGreaterThan(50);
    expect(countries).toContain('Argentina');
    expect(countries).toContain('Estados Unidos');
    expect(countries).toContain('España');
  });

  it('should filter famous people by animal for Argentina', () => {
    const tigrePeople = getCountryFamousByAnimal('Argentina', 'Tigre');
    tigrePeople.forEach(p => {
      expect(p.country.toLowerCase()).toBe('argentina');
      expect(p.animal).toBe('Tigre');
    });
  });

  it('should filter movies by animal for Argentina', () => {
    const tigreMovies = getCountryMoviesByAnimal('Argentina', 'Tigre');
    tigreMovies.forEach(m => {
      expect(m.country.toLowerCase()).toBe('argentina');
    });
  });

  it('should filter brands by animal for Argentina', () => {
    const tigreBrands = getCountryBrandsByAnimal('Argentina', 'Tigre');
    tigreBrands.forEach(b => {
      expect(b.country.toLowerCase()).toBe('argentina');
      expect(b.animal).toBe('Tigre');
    });
  });

  it('should work for Estados Unidos', () => {
    const content = getCountryContent('Estados Unidos');
    expect(content.famousPeople.length).toBeGreaterThan(10);
    expect(content.movies.length).toBeGreaterThan(5);
    expect(content.brands.length).toBeGreaterThan(50);
  });

  it('should work for España', () => {
    const content = getCountryContent('España');
    expect(content.famousPeople.length).toBeGreaterThan(0);
    expect(content.brands.length).toBeGreaterThan(0);
  });
});