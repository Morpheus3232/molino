import { FAMOUS_BY_ANIMAL, FAMOUS_BY_SIGN, type FamousPerson } from "../data/famousPeople";
import { MOVIES } from "../data/movies";
import type { SymbolicEntity } from "../data/symbolic-entities";
import { BRANDS, type BrandData } from "../data/brands";
import { ENTITIES, type EntityProfile, type EntityCategory } from "../data/entities";
import { COUNTRIES, type CountryData } from "../data/countries";
import { getEntityAnimal } from "../data/symbolic-entities";

export interface CountryContent {
  country: string;
  famousPeople: FamousPerson[];
  movies: SymbolicEntity[];
  brands: BrandData[];
  entities: EntityProfile[];
}

function normalizeCountryName(name: string): string {
  return name.toLowerCase().trim();
}

export function getCountryData(countryName: string): CountryData | undefined {
  const normalized = normalizeCountryName(countryName);
  return COUNTRIES.find(c => normalizeCountryName(c.name) === normalized);
}

export function getFamousPeopleByCountry(countryName: string): FamousPerson[] {
  const normalized = normalizeCountryName(countryName);
  const allPeople: FamousPerson[] = [
    ...Object.values(FAMOUS_BY_ANIMAL).flat(),
    ...Object.values(FAMOUS_BY_SIGN).flat(),
  ];
  const uniquePeople = new Map<string, FamousPerson>();
  allPeople.forEach(p => uniquePeople.set(`${p.name}-${p.year}`, p));
  return Array.from(uniquePeople.values()).filter(p => normalizeCountryName(p.country) === normalized);
}

export function getMoviesByCountry(countryName: string): SymbolicEntity[] {
  const normalized = normalizeCountryName(countryName);
  return MOVIES.filter(m => normalizeCountryName(m.country) === normalized);
}

export function getBrandsByCountry(countryName: string): BrandData[] {
  const normalized = normalizeCountryName(countryName);
  return BRANDS.filter(b => normalizeCountryName(b.country) === normalized);
}

export function getEntitiesByCountry(countryName: string): EntityProfile[] {
  const normalized = normalizeCountryName(countryName);
  return ENTITIES.filter(e => {
    if (e.category === 'country') {
      return normalizeCountryName(e.name) === normalized;
    }
    const countryEntity = ENTITIES.find(ent => ent.category === 'country' && normalizeCountryName(ent.name) === normalized);
    if (countryEntity && e.symbolism.chineseZodiac === countryEntity.symbolism.chineseZodiac) {
      return true;
    }
    return false;
  });
}

export function getCountryContent(countryName: string): CountryContent {
  return {
    country: countryName,
    famousPeople: getFamousPeopleByCountry(countryName),
    movies: getMoviesByCountry(countryName),
    brands: getBrandsByCountry(countryName),
    entities: getEntitiesByCountry(countryName),
  };
}

export function getCountryFamousByAnimal(countryName: string, animal: string, userYear?: number): FamousPerson[] {
  const normalized = normalizeCountryName(countryName);
  const people = FAMOUS_BY_ANIMAL[animal] ?? [];
  let filtered = people.filter(p => normalizeCountryName(p.country) === normalized);
  if (userYear) {
    filtered = filtered.filter(p => p.year !== userYear);
  }
  return filtered;
}

export function getCountryFamousBySign(countryName: string, sign: string, userYear?: number): FamousPerson[] {
  const normalized = normalizeCountryName(countryName);
  const people = FAMOUS_BY_SIGN[sign] ?? [];
  let filtered = people.filter(p => normalizeCountryName(p.country) === normalized);
  if (userYear) {
    filtered = filtered.filter(p => p.year !== userYear);
  }
  return filtered;
}

export function getCountryMoviesByAnimal(countryName: string, animal: string): SymbolicEntity[] {
  const normalized = normalizeCountryName(countryName);
  return MOVIES.filter(m => 
    normalizeCountryName(m.country) === normalized && 
    getEntityAnimal(m.foundingYear) === animal
  );
}

export function getCountryBrandsByAnimal(countryName: string, animal: string): BrandData[] {
  const normalized = normalizeCountryName(countryName);
  return BRANDS.filter(b => 
    normalizeCountryName(b.country) === normalized && 
    b.animal === animal
  );
}

export function getAvailableCountries(): string[] {
  return COUNTRIES.map(c => c.name).sort();
}

export function getCountryStats(countryName: string): {
  famousPeopleCount: number;
  moviesCount: number;
  brandsCount: number;
  entitiesCount: number;
} {
  return {
    famousPeopleCount: getFamousPeopleByCountry(countryName).length,
    moviesCount: getMoviesByCountry(countryName).length,
    brandsCount: getBrandsByCountry(countryName).length,
    entitiesCount: getEntitiesByCountry(countryName).length,
  };
}