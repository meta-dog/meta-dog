/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReferralMock, readReferralMock } from "mocks";

import { CreateReferralVM } from "./viewModel";

export function createReferral(createReferralVM: CreateReferralVM) {
  // TODO: Do API Call with axios or similar and remove mock
  // const { appId } = createReferralVM;
  // const apiUrl = `/api/app/${appId}/referral`;
  // const params = mapCreateReferralVMToAM(createReferralVM);
  const result = createReferralMock(createReferralVM);

  return Promise.resolve(result);
}
export function readReferral(appId: string) {
  // TODO: Do API Call with axios or similar and remove mock
  // const apiUrl = `/api/app/${appId}/referral`;
  const result = readReferralMock();

  return Promise.resolve(result);
}
