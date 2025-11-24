export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum FashionStyle {
  // Male Styles
  BUSINESS_SUIT = 'Business Suit',
  STREETWEAR = 'Streetwear Hoodie',
  CASUAL_DENIM = 'Casual Denim',
  SPORTY = 'Sporty Athletic',
  LEATHER_JACKET = 'Leather Jacket',
  OLD_MONEY = 'Old Money Sweater',
  TUXEDO = 'Formal Tuxedo',
  SUMMER_SHIRT = 'Summer Linen',
  WINTER_COAT = 'Winter Overcoat',
  
  // Female Styles
  EVENING_GOWN = 'Evening Gown',
  OFFICE_CHIC = 'Office Chic Blazer',
  STREET_STYLE = 'Urban Street Style',
  BOHO_DRESS = 'Boho Floral Dress',
  YOGA_OUTFIT = 'Yoga Wellness',
  LEATHER_CHIC = 'Edgy Leather',
  VINTAGE_GLAM = 'Vintage Glamour',
  COZY_KNIT = 'Cozy Knitwear',
  COCKTAIL_DRESS = 'Cocktail Party'
}

export interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  timestamp: number;
}

export interface StyleOption {
  id: string;
  label: string;
  value: string;
  gender: Gender;
  description: string;
}