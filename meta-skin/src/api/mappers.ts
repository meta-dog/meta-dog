import { AppAM, ReadReferralAM } from "./apiModel";
import { AppVM, ReadReferralVM } from "./viewModel";

export function mapAppAMToVM({ app_id: id, name }: AppAM) {
  if (id === undefined) throw Error("Undefined id");
  if (name === undefined) throw Error("Undefined name");
  return { id, name } as AppVM;
}

export function mapReadReferralAMToVM({
  advocate_id,
}: ReadReferralAM): ReadReferralVM {
  return { advocateId: advocate_id };
}
