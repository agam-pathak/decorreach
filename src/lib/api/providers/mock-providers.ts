import {
  RawBusiness,
  EnrichedBusinessData,
  VerificationResult,
  AIScoringResult,
  AIEmailGenerationParams,
  AIEmailGenerationResult,
  SendEmailParams,
  SendEmailResult,
} from '@/types/api';
import { BuyerSearchParams } from '@/types/buyer';
import {
  BusinessSearchProvider,
  EnrichmentProvider,
  EmailVerificationProvider,
  AIProvider,
  EmailProvider,
} from '../interfaces';

// 36 Authentic, Curated U.S. Home Decor Businesses
export const MOCK_US_BUYERS_DATA: (RawBusiness & {
  domain: string;
  email: string;
  employeeCount: number;
  industry: string;
  description: string;
  socials: { linkedin?: string; instagram?: string; facebook?: string; pinterest?: string };
})[] = [
  {
    externalId: 'mock_biz_1',
    sourceProvider: 'google_places',
    name: 'Urban Nest Interiors',
    category: 'Home Decor Store',
    address: '1401 S Congress Ave',
    city: 'Austin',
    state: 'Texas',
    zipCode: '78704',
    country: 'United States',
    phone: '+1 512-555-0142',
    website: 'https://urbannestinteriors.com',
    domain: 'urbannestinteriors.com',
    email: 'partnerships@urbannestinteriors.com',
    rating: 4.8,
    reviewCount: 164,
    latitude: 30.2483,
    longitude: -97.7501,
    employeeCount: 14,
    industry: 'Retail & Home Design',
    description: 'High-end Austin boutique featuring handcrafted wall decor, artisanal lighting, sustainable wooden accents, and contemporary ceramics.',
    socials: {
      instagram: 'https://instagram.com/urbannest_atx',
      facebook: 'https://facebook.com/urbannestinteriors',
      pinterest: 'https://pinterest.com/urbannest_design',
    },
  },
  {
    externalId: 'mock_biz_2',
    sourceProvider: 'yelp',
    name: 'Oak & Stone Living',
    category: 'Furniture Store',
    address: '8428 Melrose Ave',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90069',
    country: 'United States',
    phone: '+1 323-555-0891',
    website: 'https://oakandstoneliving.com',
    domain: 'oakandstoneliving.com',
    email: 'buying@oakandstoneliving.com',
    rating: 4.9,
    reviewCount: 312,
    latitude: 34.0837,
    longitude: -118.3741,
    employeeCount: 22,
    industry: 'Furniture & Decor',
    description: 'Curated showroom specializing in organic modern furniture, rustic wooden decor, wall mirrors, and artisan statement rugs.',
    socials: {
      instagram: 'https://instagram.com/oakandstoneliving',
      linkedin: 'https://linkedin.com/company/oak-and-stone-living',
    },
  },
  {
    externalId: 'mock_biz_3',
    sourceProvider: 'foursquare',
    name: 'Modern Habitat Studio',
    category: 'Interior Design Studio',
    address: '124 W 25th St',
    city: 'New York',
    state: 'New York',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 212-555-0322',
    website: 'https://modernhabitatstudio.com',
    domain: 'modernhabitatstudio.com',
    email: 'sourcing@modernhabitatstudio.com',
    rating: 4.9,
    reviewCount: 88,
    latitude: 40.7441,
    longitude: -73.9922,
    employeeCount: 18,
    industry: 'Interior Architecture & Decor',
    description: 'Premier Manhattan interior design practice sourcing bespoke wall art, sculptural lighting, and handcrafted tabletop decor for luxury residential projects.',
    socials: {
      instagram: 'https://instagram.com/modernhabitat_nyc',
      linkedin: 'https://linkedin.com/company/modernhabitatstudio',
    },
  },
  {
    externalId: 'mock_biz_4',
    sourceProvider: 'google_places',
    name: 'Pacific Coast Craft & Decor',
    category: 'Home Decor Store',
    address: '2215 1st Ave',
    city: 'Seattle',
    state: 'Washington',
    zipCode: '98121',
    country: 'United States',
    phone: '+1 206-555-0941',
    website: 'https://pacificcoastdecor.com',
    domain: 'pacificcoastdecor.com',
    email: 'procurement@pacificcoastdecor.com',
    rating: 4.7,
    reviewCount: 142,
    latitude: 47.6131,
    longitude: -122.3482,
    employeeCount: 11,
    industry: 'Home Furnishings',
    description: 'Pacific Northwest retailer focused on artisan woodwork, woven baskets, wall textiles, and organic home accessories.',
    socials: {
      instagram: 'https://instagram.com/pacificcoast_decor',
    },
  },
  {
    externalId: 'mock_biz_5',
    sourceProvider: 'yelp',
    name: 'Luxe Staging Group',
    category: 'Home Staging Company',
    address: '350 Lincoln Rd',
    city: 'Miami Beach',
    state: 'Florida',
    zipCode: '33139',
    country: 'United States',
    phone: '+1 305-555-0177',
    website: 'https://luxestagingmiami.com',
    domain: 'luxestagingmiami.com',
    email: 'inventory@luxestagingmiami.com',
    rating: 4.8,
    reviewCount: 79,
    latitude: 25.7907,
    longitude: -80.1300,
    employeeCount: 25,
    industry: 'Property Staging & Design',
    description: 'Turnkey luxury staging company furnishing multi-million dollar coastal properties with custom wall art, sculptures, mirrors, and designer accessories.',
    socials: {
      instagram: 'https://instagram.com/luxestaging_fl',
      linkedin: 'https://linkedin.com/company/luxe-staging-group',
    },
  },
  {
    externalId: 'mock_biz_6',
    sourceProvider: 'google_places',
    name: 'Wicker & Wool Home Goods',
    category: 'Gift Shop',
    address: '414 N Wells St',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '60654',
    country: 'United States',
    phone: '+1 312-555-0433',
    website: 'https://wickerandwoolhome.com',
    domain: 'wickerandwoolhome.com',
    email: 'wholesale@wickerandwoolhome.com',
    rating: 4.6,
    reviewCount: 95,
    latitude: 41.8902,
    longitude: -87.6340,
    employeeCount: 8,
    industry: 'Lifestyle & Gift Boutique',
    description: 'Boutique gift and decor shop in River North stocking artisan ceramics, handcrafted candles, table linens, and wooden serveware.',
    socials: {
      instagram: 'https://instagram.com/wickerandwool',
    },
  },
  {
    externalId: 'mock_biz_7',
    sourceProvider: 'foursquare',
    name: 'High Point Decor Wholesalers',
    category: 'Wholesale Distributor',
    address: '200 S Main St',
    city: 'High Point',
    state: 'North Carolina',
    zipCode: '27260',
    country: 'United States',
    phone: '+1 336-555-0812',
    website: 'https://highpointdecorwholesale.com',
    domain: 'highpointdecorwholesale.com',
    email: 'imports@highpointdecorwholesale.com',
    rating: 4.9,
    reviewCount: 54,
    latitude: 35.9557,
    longitude: -80.0053,
    employeeCount: 65,
    industry: 'B2B Wholesale & Distribution',
    description: 'Major East Coast furniture and decor distributor supplying hundreds of independent retail boutiques with overseas home accents, wall decor, and lighting.',
    socials: {
      linkedin: 'https://linkedin.com/company/high-point-decor-wholesalers',
    },
  },
  {
    externalId: 'mock_biz_8',
    sourceProvider: 'google_places',
    name: 'Artisan Haven Boutique',
    category: 'Boutique Store',
    address: '1628 Market St',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States',
    phone: '+1 415-555-0726',
    website: 'https://artisanhavenboutique.com',
    domain: 'artisanhavenboutique.com',
    email: 'buyer@artisanhavenboutique.com',
    rating: 4.8,
    reviewCount: 118,
    latitude: 37.7718,
    longitude: -122.4216,
    employeeCount: 6,
    industry: 'Fair Trade & Handcrafted Goods',
    description: 'Mission District curated shop highlighting ethical craftsmanship, hand-carved wooden sculptures, wall hangings, and recycled glass vases.',
    socials: {
      instagram: 'https://instagram.com/artisanhaven_sf',
    },
  },
  {
    externalId: 'mock_biz_9',
    sourceProvider: 'yelp',
    name: 'Sonoma Living & Co.',
    category: 'Home Decor Store',
    address: '125 E Napa St',
    city: 'Sonoma',
    state: 'California',
    zipCode: '95476',
    country: 'United States',
    phone: '+1 707-555-0919',
    website: 'https://sonomalivingco.com',
    domain: 'sonomalivingco.com',
    email: 'hello@sonomalivingco.com',
    rating: 4.9,
    reviewCount: 147,
    latitude: 38.2919,
    longitude: -122.4560,
    employeeCount: 9,
    industry: 'Wine Country Lifestyle & Interiors',
    description: 'Rustic yet contemporary wine-country home decor retail store stocking wooden platters, rustic wall frames, wrought iron lighting, and organic textiles.',
    socials: {
      instagram: 'https://instagram.com/sonomaliving_co',
    },
  },
  {
    externalId: 'mock_biz_10',
    sourceProvider: 'foursquare',
    name: 'Magnolia Lane Interiors',
    category: 'Interior Design Studio',
    address: '3290 Northside Pkwy NW',
    city: 'Atlanta',
    state: 'Georgia',
    zipCode: '30327',
    country: 'United States',
    phone: '+1 404-555-0348',
    website: 'https://magnolialaneinteriors.com',
    domain: 'magnolialaneinteriors.com',
    email: 'projects@magnolialaneinteriors.com',
    rating: 4.8,
    reviewCount: 62,
    latitude: 33.8471,
    longitude: -84.4283,
    employeeCount: 16,
    industry: 'Southern Residential & Commercial Design',
    description: 'Full-service interior design firm executing southern traditional and transitional hospitality and residential spaces.',
    socials: {
      instagram: 'https://instagram.com/magnolialane_atl',
      linkedin: 'https://linkedin.com/company/magnolia-lane-interiors',
    },
  },
  {
    externalId: 'mock_biz_11',
    sourceProvider: 'google_places',
    name: 'Rocky Mountain Decor Collective',
    category: 'Retail Store',
    address: '2800 E 2nd Ave',
    city: 'Denver',
    state: 'Colorado',
    zipCode: '80206',
    country: 'United States',
    phone: '+1 303-555-0621',
    website: 'https://rockymountaindecor.com',
    domain: 'rockymountaindecor.com',
    email: 'vendor-relations@rockymountaindecor.com',
    rating: 4.7,
    reviewCount: 188,
    latitude: 39.7198,
    longitude: -104.9547,
    employeeCount: 20,
    industry: 'Mountain Modern Furnishings',
    description: 'Cherry Creek destination store providing mountain modern furnishings, natural wood wall accents, stone tabletop goods, and iron fixtures.',
    socials: {
      instagram: 'https://instagram.com/rm_decorcollective',
    },
  },
  {
    externalId: 'mock_biz_12',
    sourceProvider: 'yelp',
    name: 'The French Quarter Home Emporium',
    category: 'Gift Shop',
    address: '612 Royal St',
    city: 'New Orleans',
    state: 'Louisiana',
    zipCode: '70130',
    country: 'United States',
    phone: '+1 504-555-0211',
    website: 'https://frenchquarterhome.com',
    domain: 'frenchquarterhome.com',
    email: 'orders@frenchquarterhome.com',
    rating: 4.6,
    reviewCount: 220,
    latitude: 29.9584,
    longitude: -90.0651,
    employeeCount: 7,
    industry: 'Antiques & Vintage Inspired Decor',
    description: 'Eclectic French Quarter store offering decorative mirrors, brass hardware, decorative wall plaques, and southern artisanal gifts.',
    socials: {
      instagram: 'https://instagram.com/frenchquarterhome',
    },
  },
  {
    externalId: 'mock_biz_13',
    sourceProvider: 'google_places',
    name: 'Blue Ridge Living Co.',
    category: 'Furniture Store',
    address: '38 Wall St',
    city: 'Asheville',
    state: 'North Carolina',
    zipCode: '28801',
    country: 'United States',
    phone: '+1 828-555-0554',
    website: 'https://blueridgeliving.com',
    domain: 'blueridgeliving.com',
    email: 'sourcing@blueridgeliving.com',
    rating: 4.9,
    reviewCount: 133,
    latitude: 35.5951,
    longitude: -82.5515,
    employeeCount: 12,
    industry: 'Artisan Wood & Rustic Decor',
    description: 'Asheville showroom dedicated to American and international handcrafted timber furniture, live-edge shelving, and intricate wall carvings.',
    socials: {
      instagram: 'https://instagram.com/blueridgeliving',
    },
  },
  {
    externalId: 'mock_biz_14',
    sourceProvider: 'foursquare',
    name: 'Beacon Hill Interiors',
    category: 'Interior Design Studio',
    address: '84 Charles St',
    city: 'Boston',
    state: 'Massachusetts',
    zipCode: '02114',
    country: 'United States',
    phone: '+1 617-555-0873',
    website: 'https://beaconhillinteriors.com',
    domain: 'beaconhillinteriors.com',
    email: 'trade@beaconhillinteriors.com',
    rating: 4.8,
    reviewCount: 76,
    latitude: 42.3582,
    longitude: -71.0706,
    employeeCount: 15,
    industry: 'Historic & Modern Interior Design',
    description: 'Prestigious Boston studio specifying architectural wall panels, fine art, handcrafted bronze lamps, and tailored upholstery for historic townhouses.',
    socials: {
      linkedin: 'https://linkedin.com/company/beacon-hill-interiors',
      instagram: 'https://instagram.com/beaconhill_interiors',
    },
  },
  {
    externalId: 'mock_biz_15',
    sourceProvider: 'google_places',
    name: 'Desert Bloom Decor & Gifts',
    category: 'Home Decor Store',
    address: '7014 E Camelback Rd',
    city: 'Scottsdale',
    state: 'Arizona',
    zipCode: '85251',
    country: 'United States',
    phone: '+1 480-555-0199',
    website: 'https://desertbloomdecor.com',
    domain: 'desertbloomdecor.com',
    email: 'purchasing@desertbloomdecor.com',
    rating: 4.7,
    reviewCount: 158,
    latitude: 33.5020,
    longitude: -111.9288,
    employeeCount: 10,
    industry: 'Southwestern & Modern Home Accents',
    description: 'Scottsdale showroom highlighting warm earth-tone planters, carved wood wall art, textured woven cushions, and desert lifestyle accessories.',
    socials: {
      instagram: 'https://instagram.com/desertbloomdecor',
    },
  },
  {
    externalId: 'mock_biz_16',
    sourceProvider: 'yelp',
    name: 'Nashville Modern Staging',
    category: 'Home Staging Company',
    address: '1106 8th Ave S',
    city: 'Nashville',
    state: 'Tennessee',
    zipCode: '37203',
    country: 'United States',
    phone: '+1 615-555-0482',
    website: 'https://nashvillemodernstaging.com',
    domain: 'nashvillemodernstaging.com',
    email: 'supply@nashvillemodernstaging.com',
    rating: 4.9,
    reviewCount: 104,
    latitude: 36.1486,
    longitude: -86.7828,
    employeeCount: 19,
    industry: 'Real Estate Staging & Model Homes',
    description: 'Leading Nashville home stager outfitting 150+ properties per year with stylish wall decor, accent tables, mirrors, and designer lighting.',
    socials: {
      instagram: 'https://instagram.com/nashvillemodernstaging',
    },
  },
  {
    externalId: 'mock_biz_17',
    sourceProvider: 'google_places',
    name: 'Bespoke Haven E-Commerce',
    category: 'E-commerce Store',
    address: '1900 Broadway',
    city: 'Oakland',
    state: 'California',
    zipCode: '94612',
    country: 'United States',
    phone: '+1 510-555-0761',
    website: 'https://bespokehavenhome.com',
    domain: 'bespokehavenhome.com',
    email: 'vendors@bespokehavenhome.com',
    rating: 4.8,
    reviewCount: 410,
    latitude: 37.8080,
    longitude: -122.2685,
    employeeCount: 38,
    industry: 'DTC Home Furnishings & Marketplace',
    description: 'Fast-growing digital retailer sourcing directly from international craftspeople for sustainable home decor, wall hangings, rugs, and tableware.',
    socials: {
      instagram: 'https://instagram.com/bespokehaven',
      facebook: 'https://facebook.com/bespokehavenhome',
    },
  },
  {
    externalId: 'mock_biz_18',
    sourceProvider: 'foursquare',
    name: 'Texas Heritage Furniture & Accents',
    category: 'Furniture Store',
    address: '150 Turtle Creek Blvd',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '75207',
    country: 'United States',
    phone: '+1 214-555-0935',
    website: 'https://texasheritagefurniture.com',
    domain: 'texasheritagefurniture.com',
    email: 'wholesale@texasheritagefurniture.com',
    rating: 4.8,
    reviewCount: 205,
    latitude: 32.7938,
    longitude: -96.8286,
    employeeCount: 30,
    industry: 'Design District Showroom',
    description: 'Sprawling Dallas Design District showroom catering to trade professionals and high-end residential clientele seeking solid wood decor and statement art.',
    socials: {
      instagram: 'https://instagram.com/texasheritagefurniture',
      linkedin: 'https://linkedin.com/company/texas-heritage-furniture',
    },
  },
  {
    externalId: 'mock_biz_19',
    sourceProvider: 'google_places',
    name: 'SoHo Design Works',
    category: 'Interior Design Studio',
    address: '475 Broome St',
    city: 'New York',
    state: 'New York',
    zipCode: '10013',
    country: 'United States',
    phone: '+1 212-555-0814',
    website: 'https://sohodesignworks.com',
    domain: 'sohodesignworks.com',
    email: 'design@sohodesignworks.com',
    rating: 4.9,
    reviewCount: 112,
    latitude: 40.7226,
    longitude: -74.0006,
    employeeCount: 21,
    industry: 'Commercial & Hospitality Architecture',
    description: 'New York studio designing boutique hotels, cocktail bars, and upscale lofts requiring artisan wall sculptures and custom light fixtures.',
    socials: {
      instagram: 'https://instagram.com/soho_designworks',
      linkedin: 'https://linkedin.com/company/soho-design-works',
    },
  },
  {
    externalId: 'mock_biz_20',
    sourceProvider: 'yelp',
    name: 'Coastal Haven Hospitality Group',
    category: 'Hotel',
    address: '1100 Ocean Ave',
    city: 'Santa Monica',
    state: 'California',
    zipCode: '90403',
    country: 'United States',
    phone: '+1 310-555-0450',
    website: 'https://coastalhavenhospitality.com',
    domain: 'coastalhavenhospitality.com',
    email: 'procurement@coastalhavenhospitality.com',
    rating: 4.7,
    reviewCount: 88,
    latitude: 34.0152,
    longitude: -118.4977,
    employeeCount: 120,
    industry: 'Hospitality & Luxury Resorts',
    description: 'Operator of five boutique beach resorts currently sourcing guest room wall decor, lobby artwork, and sustainable wooden accents.',
    socials: {
      linkedin: 'https://linkedin.com/company/coastal-haven-hospitality',
    },
  },
  {
    externalId: 'mock_biz_21',
    sourceProvider: 'google_places',
    name: 'Artisan Wood & Wick',
    category: 'Handmade Crafts',
    address: '725 SE Alder St',
    city: 'Portland',
    state: 'Oregon',
    zipCode: '97214',
    country: 'United States',
    phone: '+1 503-555-0678',
    website: 'https://artisanwoodwick.com',
    domain: 'artisanwoodwick.com',
    email: 'owner@artisanwoodwick.com',
    rating: 4.8,
    reviewCount: 140,
    latitude: 45.5180,
    longitude: -122.6583,
    employeeCount: 5,
    industry: 'Handmade Home Accessories',
    description: 'Portland craft collective stocking hand-poured soy candles, cedar wood trays, geometric wall hangings, and ceramic planters.',
    socials: {
      instagram: 'https://instagram.com/artisanwoodwick',
    },
  },
  {
    externalId: 'mock_biz_22',
    sourceProvider: 'foursquare',
    name: 'Midwest Importers & Distributors',
    category: 'Importer',
    address: '444 W Lake St',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '60606',
    country: 'United States',
    phone: '+1 312-555-0899',
    website: 'https://midwestimportersdecor.com',
    domain: 'midwestimportersdecor.com',
    email: 'sourcing@midwestimportersdecor.com',
    rating: 4.7,
    reviewCount: 45,
    latitude: 41.8857,
    longitude: -87.6401,
    employeeCount: 48,
    industry: 'International Sourcing & Wholesale',
    description: 'Direct importer connecting Indian and Southeast Asian artisanal decor manufacturers with 300+ retail stores across the Midwest.',
    socials: {
      linkedin: 'https://linkedin.com/company/midwest-importers-decor',
    },
  },
  {
    externalId: 'mock_biz_23',
    sourceProvider: 'google_places',
    name: 'Serena & Stone Lifestyle',
    category: 'Home Decor Store',
    address: '342 S Coast Hwy',
    city: 'Laguna Beach',
    state: 'California',
    zipCode: '92651',
    country: 'United States',
    phone: '+1 949-555-0238',
    website: 'https://serenaandstoneliving.com',
    domain: 'serenaandstoneliving.com',
    email: 'curator@serenaandstoneliving.com',
    rating: 4.9,
    reviewCount: 167,
    latitude: 33.5417,
    longitude: -117.7818,
    employeeCount: 12,
    industry: 'Coastal Contemporary Retail',
    description: 'Iconic Laguna Beach boutique showcasing coastal minimalist wall art, woven rattan accessories, travertine decor, and linen cushion covers.',
    socials: {
      instagram: 'https://instagram.com/serena_and_stone',
    },
  },
  {
    externalId: 'mock_biz_24',
    sourceProvider: 'yelp',
    name: 'Capitol Hill Living & Design',
    category: 'Interior Design Studio',
    address: '650 Pennsylvania Ave SE',
    city: 'Washington',
    state: 'District of Columbia',
    zipCode: '20003',
    country: 'United States',
    phone: '+1 202-555-0743',
    website: 'https://capitolhillliving.com',
    domain: 'capitolhillliving.com',
    email: 'info@capitolhillliving.com',
    rating: 4.8,
    reviewCount: 89,
    latitude: 38.8848,
    longitude: -76.9964,
    employeeCount: 14,
    industry: 'Bespoke Residential Design',
    description: 'Washington DC studio curating historic rowhomes with artisanal woodwork, carved mantlepieces, and custom framed wall art.',
    socials: {
      instagram: 'https://instagram.com/capitolhillliving',
    },
  },
  {
    externalId: 'mock_biz_25',
    sourceProvider: 'google_places',
    name: 'Twin Cities Decor Depot',
    category: 'Retail Store',
    address: '800 Washington Ave N',
    city: 'Minneapolis',
    state: 'Minnesota',
    zipCode: '55401',
    country: 'United States',
    phone: '+1 612-555-0371',
    website: 'https://twincitiesdecordepot.com',
    domain: 'twincitiesdecordepot.com',
    email: 'inventory@twincitiesdecordepot.com',
    rating: 4.6,
    reviewCount: 125,
    latitude: 44.9862,
    longitude: -93.2758,
    employeeCount: 18,
    industry: 'North Loop Home Retail',
    description: 'Warehouse showroom in Minneapolis North Loop neighborhood featuring Scandinavian modern and industrial decor, wall mirrors, and wooden shelving.',
    socials: {
      instagram: 'https://instagram.com/twincitiesdecordepot',
    },
  },
  {
    externalId: 'mock_biz_26',
    sourceProvider: 'foursquare',
    name: 'Charleston Veranda & Home',
    category: 'Boutique Store',
    address: '185 King St',
    city: 'Charleston',
    state: 'South Carolina',
    zipCode: '29401',
    country: 'United States',
    phone: '+1 843-555-0524',
    website: 'https://charlestonverandahome.com',
    domain: 'charlestonverandahome.com',
    email: 'merchandise@charlestonverandahome.com',
    rating: 4.9,
    reviewCount: 198,
    latitude: 32.7788,
    longitude: -79.9329,
    employeeCount: 8,
    industry: 'Historic Coastal Boutique',
    description: 'Beloved King Street boutique with curated southern lifestyle decor, botanical wall prints, woven sweetgrass baskets, and brass hurricane lanterns.',
    socials: {
      instagram: 'https://instagram.com/charlestonverandahome',
    },
  },
  {
    externalId: 'mock_biz_27',
    sourceProvider: 'google_places',
    name: 'Lone Star Staging & Interiors',
    category: 'Home Staging Company',
    address: '5307 E Mockingbird Ln',
    city: 'Dallas',
    state: 'Texas',
    zipCode: '75206',
    country: 'United States',
    phone: '+1 214-555-0683',
    website: 'https://lonestarstaging.com',
    domain: 'lonestarstaging.com',
    email: 'orders@lonestarstaging.com',
    rating: 4.8,
    reviewCount: 92,
    latitude: 32.8374,
    longitude: -96.7698,
    employeeCount: 17,
    industry: 'Luxury Residential Staging',
    description: 'High-volume Dallas staging company outfitting executive estates with oversize wall art, carved consoles, and contemporary decor.',
    socials: {
      instagram: 'https://instagram.com/lonestarstaging',
    },
  },
  {
    externalId: 'mock_biz_28',
    sourceProvider: 'yelp',
    name: 'Silver Lake Artisan Living',
    category: 'Gift Shop',
    address: '3815 W Sunset Blvd',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90026',
    country: 'United States',
    phone: '+1 323-555-0955',
    website: 'https://silverlakeartisanliving.com',
    domain: 'silverlakeartisanliving.com',
    email: 'buying@silverlakeartisanliving.com',
    rating: 4.7,
    reviewCount: 134,
    latitude: 34.0911,
    longitude: -118.2801,
    employeeCount: 6,
    industry: 'Boho & Indie Home Goods',
    description: 'Eclectic Silver Lake shop stocking bohemian woven wall tapestries, hand-turned wooden bowls, and artisanal brass accents.',
    socials: {
      instagram: 'https://instagram.com/silverlakeartisan',
    },
  },
  {
    externalId: 'mock_biz_29',
    sourceProvider: 'google_places',
    name: 'Hudson Valley Craft Home',
    category: 'Home Decor Store',
    address: '522 Warren St',
    city: 'Hudson',
    state: 'New York',
    zipCode: '12534',
    country: 'United States',
    phone: '+1 518-555-0319',
    website: 'https://hudsonvalleycrafthome.com',
    domain: 'hudsonvalleycrafthome.com',
    email: 'curator@hudsonvalleycrafthome.com',
    rating: 4.9,
    reviewCount: 176,
    latitude: 42.2514,
    longitude: -73.7891,
    employeeCount: 11,
    industry: 'Upstate Artisan Lifestyle',
    description: 'Warren Street Hudson design destination known for bespoke woodwork, handmade ironwork, rustic wall installations, and antique-inspired ceramics.',
    socials: {
      instagram: 'https://instagram.com/hudsonvalleycraft',
    },
  },
  {
    externalId: 'mock_biz_30',
    sourceProvider: 'foursquare',
    name: 'Palm & Pine Hospitality Decor',
    category: 'Wholesale Distributor',
    address: '700 S Rosemary Ave',
    city: 'West Palm Beach',
    state: 'Florida',
    zipCode: '33401',
    country: 'United States',
    phone: '+1 561-555-0844',
    website: 'https://palmandpinedecor.com',
    domain: 'palmandpinedecor.com',
    email: 'trade@palmandpinedecor.com',
    rating: 4.8,
    reviewCount: 51,
    latitude: 26.7093,
    longitude: -80.0573,
    employeeCount: 35,
    industry: 'Commercial & Hospitality Furnishings',
    description: 'Contract distributor supplying boutique hotels, clubhouses, and luxury restaurants throughout Florida and the Caribbean.',
    socials: {
      linkedin: 'https://linkedin.com/company/palm-and-pine-decor',
    },
  },
  {
    externalId: 'mock_biz_31',
    sourceProvider: 'google_places',
    name: 'Savannah Riverfront Antiques & Decor',
    category: 'Retail Store',
    address: '409 E River St',
    city: 'Savannah',
    state: 'Georgia',
    zipCode: '31401',
    country: 'United States',
    phone: '+1 912-555-0266',
    website: 'https://savannahriverfrontdecor.com',
    domain: 'savannahriverfrontdecor.com',
    email: 'buyers@savannahriverfrontdecor.com',
    rating: 4.7,
    reviewCount: 161,
    latitude: 32.0792,
    longitude: -81.0877,
    employeeCount: 9,
    industry: 'Historic Southern Decor',
    description: 'Historic Savannah shop featuring hand-carved decorative panels, wrought iron chandeliers, reclaimed wood decor, and traditional Southern accents.',
    socials: {
      instagram: 'https://instagram.com/savannahriverfrontdecor',
    },
  },
  {
    externalId: 'mock_biz_32',
    sourceProvider: 'yelp',
    name: 'Aspen Ridge Mountain Interiors',
    category: 'Interior Design Studio',
    address: '426 E Hyman Ave',
    city: 'Aspen',
    state: 'Colorado',
    zipCode: '81611',
    country: 'United States',
    phone: '+1 970-555-0888',
    website: 'https://aspenridgeinteriors.com',
    domain: 'aspenridgeinteriors.com',
    email: 'projects@aspenridgeinteriors.com',
    rating: 4.9,
    reviewCount: 71,
    latitude: 39.1887,
    longitude: -106.8183,
    employeeCount: 16,
    industry: 'Ultra-Luxury Alpine Interiors',
    description: 'Elite mountain interior studio designing luxury ski chalets, specifying natural stone, solid timber carvings, bronze lighting, and wool textiles.',
    socials: {
      instagram: 'https://instagram.com/aspenridge_interiors',
      linkedin: 'https://linkedin.com/company/aspen-ridge-interiors',
    },
  },
  {
    externalId: 'mock_biz_33',
    sourceProvider: 'google_places',
    name: 'Scottsdale Artisan Market Co.',
    category: 'Gift Shop',
    address: '3925 N Brown Ave',
    city: 'Scottsdale',
    state: 'Arizona',
    zipCode: '85251',
    country: 'United States',
    phone: '+1 480-555-0477',
    website: 'https://scottsdaleartisanmarket.com',
    domain: 'scottsdaleartisanmarket.com',
    email: 'wholesale@scottsdaleartisanmarket.com',
    rating: 4.8,
    reviewCount: 139,
    latitude: 33.4925,
    longitude: -111.9248,
    employeeCount: 7,
    industry: 'Desert Artisan Showcase',
    description: 'Old Town Scottsdale retail gallery presenting handcrafted southwestern decor, carved wooden coyote figurines, wall sunbursts, and turquoise accents.',
    socials: {
      instagram: 'https://instagram.com/scottsdaleartisanmarket',
    },
  },
  {
    externalId: 'mock_biz_34',
    sourceProvider: 'foursquare',
    name: 'Portland Eco Home Collective',
    category: 'E-commerce Store',
    address: '1130 SW Morrison St',
    city: 'Portland',
    state: 'Oregon',
    zipCode: '97205',
    country: 'United States',
    phone: '+1 503-555-0912',
    website: 'https://portlandecohome.com',
    domain: 'portlandecohome.com',
    email: 'buyers@portlandecohome.com',
    rating: 4.8,
    reviewCount: 284,
    latitude: 45.5204,
    longitude: -122.6841,
    employeeCount: 22,
    industry: 'Sustainable & Fair Trade DTC Home Goods',
    description: 'Omnichannel retailer and online store emphasizing carbon-neutral shipping and ethically sourced sustainable wooden wall decor and baskets.',
    socials: {
      instagram: 'https://instagram.com/portlandecohome',
      pinterest: 'https://pinterest.com/portlandecohome',
    },
  },
  {
    externalId: 'mock_biz_35',
    sourceProvider: 'google_places',
    name: 'Key West Island Living Co.',
    category: 'Boutique Store',
    address: '510 Duval St',
    city: 'Key West',
    state: 'Florida',
    zipCode: '33040',
    country: 'United States',
    phone: '+1 305-555-0639',
    website: 'https://keywestislandliving.com',
    domain: 'keywestislandliving.com',
    email: 'aloha@keywestislandliving.com',
    rating: 4.7,
    reviewCount: 195,
    latitude: 24.5542,
    longitude: -81.7997,
    employeeCount: 9,
    industry: 'Tropical & Resort Furnishings',
    description: 'Vibrant Duval Street shop specializing in tropical hardwood carvings, coastal wall art, driftwood mirrors, and island lifestyle home decor.',
    socials: {
      instagram: 'https://instagram.com/keywestislandliving',
    },
  },
  {
    externalId: 'mock_biz_36',
    sourceProvider: 'yelp',
    name: 'San Diego Modern Coastal Studio',
    category: 'Interior Design Studio',
    address: '7744 Girard Ave',
    city: 'La Jolla',
    state: 'California',
    zipCode: '92037',
    country: 'United States',
    phone: '+1 858-555-0210',
    website: 'https://sandiegocoastalstudio.com',
    domain: 'sandiegocoastalstudio.com',
    email: 'sourcing@sandiegocoastalstudio.com',
    rating: 4.9,
    reviewCount: 94,
    latitude: 32.8447,
    longitude: -117.2731,
    employeeCount: 14,
    industry: 'Coastal Luxury Interiors',
    description: 'La Jolla studio renowned for airy coastal architecture, sourcing organic wood accents, woven lighting pendants, and minimal wall sculptures.',
    socials: {
      instagram: 'https://instagram.com/sandiegocoastalstudio',
      linkedin: 'https://linkedin.com/company/san-diego-coastal-studio',
    },
  },
];

// Mock Business Search Provider
export class MockBusinessProvider implements BusinessSearchProvider {
  name = 'mock_directory' as const;
  displayName = 'Verified U.S. Business Directory (Mock Fallback)';

  isAvailable(): boolean {
    return true;
  }

  async search(params: BuyerSearchParams): Promise<RawBusiness[]> {
    // Artificial latency simulation to emulate real HTTP API roundtrip
    await new Promise((r) => setTimeout(r, 650));

    let filtered = [...MOCK_US_BUYERS_DATA];

    // Filter by state if specified
    if (params.states && params.states.length > 0 && !params.states.includes('All States')) {
      const selectedStatesLower = params.states.map((s) => s.toLowerCase());
      filtered = filtered.filter((b) => b.state && selectedStatesLower.includes(b.state.toLowerCase()));
      // If filter returns too few, retain at least a subset so search remains productive
      if (filtered.length < 5) {
        filtered = MOCK_US_BUYERS_DATA.slice(0, 15);
      }
    }

    // Filter by buyer type if specified
    if (params.buyerTypes && params.buyerTypes.length > 0) {
      const typesLower = params.buyerTypes.map((t) => t.toLowerCase());
      const typeMatches = filtered.filter((b) =>
        typesLower.some((t) => b.category?.toLowerCase().includes(t) || t.includes(b.category?.toLowerCase() || ''))
      );
      if (typeMatches.length >= 6) {
        filtered = typeMatches;
      }
    }

    return filtered.map((b) => ({
      externalId: b.externalId,
      sourceProvider: b.sourceProvider,
      name: b.name,
      category: b.category,
      address: b.address,
      city: b.city,
      state: b.state,
      zipCode: b.zipCode,
      country: b.country,
      phone: b.phone,
      website: b.website,
      rating: b.rating,
      reviewCount: b.reviewCount,
      latitude: b.latitude,
      longitude: b.longitude,
      rawPayload: {
        employeeCount: b.employeeCount,
        description: b.description,
        industry: b.industry,
        email: b.email,
        socials: b.socials,
      },
    }));
  }
}

// Mock Enrichment Provider
export class MockEnrichmentProvider implements EnrichmentProvider {
  name = 'mock_enrichment' as const;
  displayName = 'Apollo / Clearbit Mock Enrichment';

  isAvailable(): boolean {
    return true;
  }

  async enrich(business: RawBusiness): Promise<EnrichedBusinessData> {
    await new Promise((r) => setTimeout(r, 120));
    const found = MOCK_US_BUYERS_DATA.find((m) => m.name.toLowerCase() === business.name.toLowerCase());

    if (found) {
      return {
        domain: found.domain,
        businessEmail: found.email,
        emailStatus: 'verified',
        employeeCount: found.employeeCount,
        industry: found.industry,
        description: found.description,
        socialProfiles: found.socials,
        sourceProvider: 'mock_enrichment',
      };
    }

    const domain = business.website ? business.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0] : 'decorpartner.com';
    return {
      domain,
      businessEmail: `inquiries@${domain}`,
      emailStatus: 'verified',
      employeeCount: 12,
      industry: 'Home Decor & Furnishings',
      description: `${business.name} is a premier retailer and design entity located in ${business.city || 'the U.S.'}.`,
      socialProfiles: {
        instagram: `https://instagram.com/${business.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      },
      sourceProvider: 'mock_enrichment',
    };
  }
}

// Mock Email Verification Provider
export class MockVerificationProvider implements EmailVerificationProvider {
  name = 'mock_verification' as const;
  displayName = 'Hunter / ZeroBounce Email Verifier';

  isAvailable(): boolean {
    return true;
  }

  async verify(email: string): Promise<VerificationResult> {
    await new Promise((r) => setTimeout(r, 150));
    const isInvalid = email.includes('fake') || email.includes('invalid') || !email.includes('@');
    const isRisky = email.includes('catchall') || email.includes('temp');

    if (isInvalid) {
      return {
        email,
        status: 'invalid',
        score: 15,
        provider: 'mock_verification',
        mxFound: false,
        smtpCheck: false,
        disposable: true,
        details: 'Mailbox does not exist on remote server',
      };
    }

    if (isRisky) {
      return {
        email,
        status: 'risky',
        score: 62,
        provider: 'mock_verification',
        mxFound: true,
        smtpCheck: false,
        disposable: false,
        details: 'Catch-all domain configuration detected',
      };
    }

    return {
      email,
      status: 'verified',
      score: 98,
      provider: 'mock_verification',
      mxFound: true,
      smtpCheck: true,
      disposable: false,
      details: 'Deliverable business inbox confirmed via SMTP handshake',
    };
  }
}

// Mock AI Provider
export class MockAIProvider implements AIProvider {
  name = 'mock_ai' as const;
  displayName = 'OpenAI / Gemini Structured AI Engine';

  isAvailable(): boolean {
    return true;
  }

  async analyzeBuyer(product: any, buyer: any): Promise<AIScoringResult> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      matchScore: 91,
      relevance: 'excellent',
      buyerType: buyer.buyerType || 'Home Decor Retailer',
      reasons: [
        `Curated catalog in ${buyer.category || 'Home Decor'} directly aligns with your ${product.name || 'home goods'}.`,
        `Commercial presence in ${buyer.city || 'U.S.'}, ${buyer.state || ''} reaches your primary target demographic.`,
        `Demonstrated focus on handcrafted, artisanal design aesthetics.`,
      ],
      recommendedPitch: `Highlight handcrafted craftsmanship, wholesale minimums, fast U.S. fulfillment, and margin potential for ${buyer.businessName}.`,
    };
  }

  async generatePersonalizedEmail(params: AIEmailGenerationParams): Promise<AIEmailGenerationResult> {
    await new Promise((r) => setTimeout(r, 250));
    const bName = params.buyer.businessName;
    const city = params.buyer.city || 'your area';
    const sName = params.sellerProfile.sellerName || 'Our Team';
    const sCompany = params.sellerProfile.companyName || 'Artisan Decor Co.';
    const prodName = params.sellerProduct.name || 'handcrafted home decor';
    const sWebsite = params.sellerProfile.website || 'https://decorreach.com';

    const subject = `Wholesale Inquiry: ${prodName} for ${bName}`;
    const body = `Hi ${bName} Team,

I came across ${bName} while researching leading design and retail businesses in ${city}, and I was really impressed by your curated collection and eye for design.

At ${sCompany}, we specialize in manufacturing premium ${prodName}. Our pieces are crafted with sustainable materials and high attention to detail, designed specifically for boutique retailers and interior designers seeking unique, high-margin items.

Given your aesthetic focus, I believe our upcoming line could be a natural fit for your clientele.

Would you be open to reviewing our digital wholesale lookbook and pricing sheet this week?

Warm regards,

${sName}
${sCompany}
${sWebsite}`;

    return {
      subject,
      body,
      callToAction: 'Request Digital Lookbook & Wholesale Pricing Sheet',
      confidenceScore: 0.94,
    };
  }
}

// Mock Email Delivery Provider
export class MockEmailProvider implements EmailProvider {
  name = 'mock_email' as const;
  displayName = 'Resend / SendGrid Mock Sender';

  isAvailable(): boolean {
    return true;
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      provider: 'mock_email',
      status: 'simulated',
      simulated: true,
    };
  }
}
