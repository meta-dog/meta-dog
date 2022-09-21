/* eslint-disable @typescript-eslint/no-unused-vars */
import { postReferralMock } from "mocks";

import { CreateReferralVM } from "./viewModel";

export default function postReferral(postReferralVM: CreateReferralVM) {
  // TODO: Do API Call with axios or similar and remove mock
  // const { appId } = createReferralVM;
  // const apiUrl = `/api/app/${appId}/referral`;
  // const params = mapCreateReferralVMToAM(createReferralVM);
  const result = postReferralMock(postReferralVM);

  return Promise.resolve(result);
}
