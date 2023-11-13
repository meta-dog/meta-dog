export interface AppVM {
  id: string;
  name: string;
}
export interface RegionVM {
  region: string;
}

export interface CreateReferralVM {
  advocateId: string;
  appId: string;
}

export const REGIONS = [
  "ES",
  "UK",
  "NL",
  "US",
  "BE",
  "CA",
  "AU",
  "NZ",
  "IT",
  "AT",
  "KR",
  "PL",
  "IE",
  "UA",
  "DE",
  "FR",
  "JP",
  "NO",
  "CH",
] as const;
export type Region = typeof REGIONS[number];

export interface CreateDeviceReferralVM {
  advocateId: string;
  region: Region;
}
export interface ReadReferralVM {
  advocateId: string;
}
