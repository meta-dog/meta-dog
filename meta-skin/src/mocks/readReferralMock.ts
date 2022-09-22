import { ReadReferralVM, mapReadReferralAMToVM } from "api";

import referrals from "./referrals.json";

export default function readReferralMock(): ReadReferralVM {
  const index = Math.floor(Math.random() * referrals.length);
  return mapReadReferralAMToVM(referrals[index]);
}
