import { StatusCodes } from "http-status-codes";

import { AppAM, ReadReferralAM } from "./apiModel";
import apiCall from "./baseApi";
import { mapAppAMToVM, mapReadReferralAMToVM } from "./mappers";
import { CreateReferralVM } from "./viewModel";

export async function readApps() {
  const readAppsURL = `apps`;
  try {
    const { data } = await apiCall("GET", readAppsURL);
    return (data as AppAM[]).map(mapAppAMToVM);
  } catch (error) {
    throw new Error(`Error getting Apps: ${error}`);
  }
}

export async function createReferral({ advocateId, appId }: CreateReferralVM) {
  const createReferralURL = `app/${appId}/queue/${advocateId}`;
  try {
    const { status } = await apiCall("POST", createReferralURL);
    if (status === StatusCodes.CREATED) return appId;
    throw new Error("generic");
  } catch (error) {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { status } = (error as any)?.response;
    const code = Number.parseInt(status, 10);
    if (code === StatusCodes.UNPROCESSABLE_ENTITY) {
      throw new Error("unprocessable");
    }
    if (code === StatusCodes.CONFLICT) throw new Error("conflict");
    throw new Error("generic");
  }
}

export async function readReferral(appId: string) {
  const readReferralURL = `app/${appId}/referral`;
  try {
    const { data } = await apiCall("GET", readReferralURL);
    return mapReadReferralAMToVM(data as ReadReferralAM);
  } catch (error) {
    throw new Error(`Error creating referral: ${error}`);
  }
}
