export interface AppVM {
  id: string;
  name: string;
}

export interface CreateReferralVM {
  advocateId: string;
  appId: string;
}
export interface ReadReferralVM {
  advocateId: string;
}
