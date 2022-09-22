import { StatusCodes } from "http-status-codes";

import { CreateReferralVM } from "api";

import advocates from "./advocates.json";

// https://www.oculus.com/appreferrals/great-guy/1251251/?utm_source=3 201
// https://www.oculus.com/appreferrals/great-guy/2323124/?utm_source=3 409
// https://www.oculus.com/appreferrals/great-guy/1672671/?utm_source=3 404
// https://www.oculus.com/appreferrals/great-guy/5138511912885491/?utm_source=3 409
// https://www.oculus.com/appreferrals/maybe-good-gal/1251251/?utm_source=3 201
// https://www.oculus.com/appreferrals/maybe-good-gal/2323124/?utm_source=3 201
// https://www.oculus.com/appreferrals/maybe-good-gal/1672671/?utm_source=3 404
// https://www.oculus.com/appreferrals/maybe-good-gal/5138511912885491/?utm_source=3 404

export default function createReferralMock({
  appId,
  advocateId,
}: CreateReferralVM) {
  const advocate = advocates.find(({ username }) => username === advocateId);
  if (advocate === undefined) return Promise.reject(StatusCodes.NOT_FOUND);
  const status = advocate.appIds.find(({ input }) => input === appId)?.[
    "status-code"
  ];
  if (status === undefined) return Promise.reject(StatusCodes.NOT_FOUND);
  if (status === StatusCodes.CREATED) return Promise.resolve(appId);
  return Promise.reject(status);
}
