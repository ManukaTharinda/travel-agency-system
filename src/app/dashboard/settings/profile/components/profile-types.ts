
export interface AgencyProfile {
  name: string;
  legalName: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
}

export const emptyProfile: AgencyProfile = {
  name: "",
  legalName: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  logoUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
};
