import { SmartLinks } from '../../types';
import { NormalizedBusiness } from '../normalizer.service';

export function generateSmartLinks(business: NormalizedBusiness): SmartLinks {
  const searchQuery = encodeURIComponent(`${business.name} ${business.city} official website`);
  const mapsQuery = encodeURIComponent(`${business.name} ${business.address}`);

  return {
    googleSearchUrl: `https://www.google.com/search?q=${searchQuery}`,
    googleMapsUrl: `https://www.google.com/maps/search/${mapsQuery}`,
  };
}