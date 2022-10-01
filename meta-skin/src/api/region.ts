import { StatusCodes } from "http-status-codes";

import { ReadReferralAM } from "./apiModel";
import apiCall from "./baseApi";
import { mapReadReferralAMToVM } from "./mappers";
import { CreateDeviceReferralVM, Region } from "./viewModel";

export async function createDeviceReferral({
  advocateId,
  region,
}: CreateDeviceReferralVM) {
  const createDeviceReferralURL = `region/${region}/queue/${advocateId}`;
  try {
    const { status } = await apiCall("POST", createDeviceReferralURL);
    if (status === StatusCodes.CREATED) return region;
    throw new Error("generic");
  } catch (error) {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { status } = (error as any)?.response;
    const code = Number.parseInt(status, 10);
    if (code === StatusCodes.UNPROCESSABLE_ENTITY) {
      throw new Error("unprocessable");
    }
    if (code === StatusCodes.CONFLICT) throw new Error("conflict");
    if (code === StatusCodes.BAD_REQUEST) throw new Error("badrequest");
    throw new Error("generic");
  }
}

export async function readDeviceReferral(region: Region) {
  const readReferralURL = `region/${region}/referral`;
  try {
    const { data } = await apiCall("GET", readReferralURL);
    return mapReadReferralAMToVM(data as ReadReferralAM);
  } catch (error) {
    throw new Error(`Error reading referral: ${error}`);
  }
}
