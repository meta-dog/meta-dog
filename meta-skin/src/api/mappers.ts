import { AppAM, CreateReferralAM } from "./apiModel";
import { AppVM, CreateReferralVM } from "./viewModel";

export function mapAppAMToVM({ id, name }: AppAM) {
  return { id, name } as AppVM;
}

export function mapCreateReferralVMToAM({
  advocateId,
}: CreateReferralVM): CreateReferralAM {
  return { advocate_id: advocateId };
}
