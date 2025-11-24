import { Gender, FashionStyle, StyleOption } from './types';

export const STYLE_OPTIONS: StyleOption[] = [
  // Male Options (9 styles)
  { id: 'm1', label: 'Business Suit', value: FashionStyle.BUSINESS_SUIT, gender: Gender.MALE, description: 'Professional, sharp, confident' },
  { id: 'm2', label: 'Streetwear', value: FashionStyle.STREETWEAR, gender: Gender.MALE, description: 'Trendy, hoodie, urban' },
  { id: 'm3', label: 'Casual Denim', value: FashionStyle.CASUAL_DENIM, gender: Gender.MALE, description: 'Relaxed, classic jeans jacket' },
  { id: 'm4', label: 'Sporty', value: FashionStyle.SPORTY, gender: Gender.MALE, description: 'Athletic, gym ready, energetic' },
  { id: 'm5', label: 'Leather Jacket', value: FashionStyle.LEATHER_JACKET, gender: Gender.MALE, description: 'Edgy, cool, masculine' },
  { id: 'm6', label: 'Old Money', value: FashionStyle.OLD_MONEY, gender: Gender.MALE, description: 'Sophisticated, polo, sweater' },
  { id: 'm7', label: 'Formal Tuxedo', value: FashionStyle.TUXEDO, gender: Gender.MALE, description: 'Elegant, black tie, gala' },
  { id: 'm8', label: 'Summer Linen', value: FashionStyle.SUMMER_SHIRT, gender: Gender.MALE, description: 'Breezy, vacation, light' },
  { id: 'm9', label: 'Winter Coat', value: FashionStyle.WINTER_COAT, gender: Gender.MALE, description: 'Warm, layered, stylish' },

  // Female Options (9 styles)
  { id: 'f1', label: 'Evening Gown', value: FashionStyle.EVENING_GOWN, gender: Gender.FEMALE, description: 'Glamorous, red carpet, elegant' },
  { id: 'f2', label: 'Office Chic', value: FashionStyle.OFFICE_CHIC, gender: Gender.FEMALE, description: 'Professional, blazer, boss' },
  { id: 'f3', label: 'Street Style', value: FashionStyle.STREET_STYLE, gender: Gender.FEMALE, description: 'Trendy, urban, fashion-forward' },
  { id: 'f4', label: 'Boho Dress', value: FashionStyle.BOHO_DRESS, gender: Gender.FEMALE, description: 'Flowy, floral, summer vibe' },
  { id: 'f5', label: 'Yoga Fit', value: FashionStyle.YOGA_OUTFIT, gender: Gender.FEMALE, description: 'Athleisure, healthy, active' },
  { id: 'f6', label: 'Edgy Leather', value: FashionStyle.LEATHER_CHIC, gender: Gender.FEMALE, description: 'Cool, biker jacket, bold' },
  { id: 'f7', label: 'Vintage Glam', value: FashionStyle.VINTAGE_GLAM, gender: Gender.FEMALE, description: 'Retro, hollywood, classic' },
  { id: 'f8', label: 'Cozy Knit', value: FashionStyle.COZY_KNIT, gender: Gender.FEMALE, description: 'Warm, soft, comfortable' },
  { id: 'f9', label: 'Cocktail Dress', value: FashionStyle.COCKTAIL_DRESS, gender: Gender.FEMALE, description: 'Party, fun, sophisticated' },
];

export const PROMPT_TEMPLATES = {
  [Gender.MALE]: (style: string) => `Generate a medium-shot portrait of the person from the input image. 
  OUTFIT: He is wearing a ${style}.
  VIBE: Make him look sunny, handsome, and confident.
  COMPOSITION: The subject must be perfectly CENTERED in the image.
  FACE: Keep the facial features EXACTLY the same as the source image (Identity Preservation).
  BACKGROUND: A suitable background that matches the ${style} theme.`,
  
  [Gender.FEMALE]: (style: string) => `Generate a medium-shot portrait of the person from the input image.
  OUTFIT: She is wearing a ${style}.
  VIBE: Make her look sexy, alluring, and moving.
  COMPOSITION: The subject must be perfectly CENTERED in the image.
  FACE: Keep the facial features EXACTLY the same as the source image (Identity Preservation).
  BACKGROUND: A suitable background that matches the ${style} theme.`
};