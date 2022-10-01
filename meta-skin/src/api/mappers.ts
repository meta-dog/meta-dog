import { AppAM, ReadReferralAM, RegionAM } from "./apiModel";
import { AppVM, ReadReferralVM, RegionVM } from "./viewModel";

export function mapAppAMToVM({ app_id: id, name, has_quest, has_rift }: AppAM) {
  if (id === undefined) throw Error("Undefined id");
  if (name === undefined) throw Error("Undefined name");
  const questName = has_quest ? " (Quest)" : "";
  const riftName = has_rift ? " (Rift)" : "";
  const displayName = `${name}${questName}${riftName}`.trim();
  return { id, name: displayName } as AppVM;
}

export function mapReadReferralAMToVM({
  advocate_id,
}: ReadReferralAM): ReadReferralVM {
  return { advocateId: advocate_id };
}

export function mapRegionAMToVM({ region }: RegionAM) {
  return { region } as RegionVM;
}
