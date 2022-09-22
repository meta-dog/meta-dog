import { AppAM, CreateReferralAM, ReadReferralAM } from "./apiModel";
import { AppVM, CreateReferralVM, ReadReferralVM } from "./viewModel";

export function mapAppAMToVM({ id, name }: AppAM) {
  return { id, name } as AppVM;
}

export function mapCreateReferralVMToAM({
  advocateId,
}: CreateReferralVM): CreateReferralAM {
  return { advocate_id: advocateId };
}

export function mapReadReferralVMToAM({
  advocate_id,
}: ReadReferralAM): ReadReferralVM {
  return { advocateId: advocate_id };
}
