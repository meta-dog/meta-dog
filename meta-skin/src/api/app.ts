import { AppAM } from "./apiModel";
import apiCall from "./baseApi";
import { mapAppAMToVM } from "./mappers";

export default async function readApps() {
  const readAppsURL = `apps`;
  try {
    const { data } = await apiCall("GET", readAppsURL);
    return (data as AppAM[]).map(mapAppAMToVM);
  } catch (error) {
    throw new Error(`Error getting Apps: ${error}`);
  }
}
