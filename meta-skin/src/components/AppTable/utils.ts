import { CreateReferralVM } from "api";

const BASE_URL = "https://www.oculus.com/appreferrals/";

export function extractReferral(url: string): false | CreateReferralVM {
  if (url.indexOf(BASE_URL) !== 0) return false;
  const shortenedUrl = url.substring(BASE_URL.length);
  const urlMatch = shortenedUrl.match(
    /^(?<advocateId>[^/]+)\/(?<appId>[0-9]+)/,
  );
  if (urlMatch === null) return false;
  if (urlMatch.groups === undefined) return false;
  const { advocateId, appId } = urlMatch.groups;
  if (advocateId === undefined || appId === undefined) return false;
  return { advocateId, appId };
}

export function extractUrls(text: string) {
  const urlRegex =
    /\s*(?<url>https:\/\/www.oculus.com\/appreferrals\/[\w.\-/?*&_=]+)\s*/g;
  const allMatches = text.matchAll(urlRegex);
  return Array.from(allMatches).reduce((prev, match) => {
    const url = match.groups?.url;
    if (url !== undefined) prev.push(url);
    return prev;
  }, []);
}

export function saveBoolean(key: "referral-dialog-on", value: boolean) {
  localStorage.setItem(key, String(value));
}

export function getSavedBoolean(key: "referral-dialog-on") {
  let value = true;
  const activateReferralModal = localStorage.getItem(key);
  if (activateReferralModal === "false") {
    value = false;
  }
  saveBoolean(key, value);
  return value;
}

export function getSavedAdvocateId(): string | null {
  return localStorage.getItem("advocate-id");
}
export function saveAdvocateId(advocateId: string) {
  localStorage.setItem("advocate-id", advocateId);
}

export function getSavedAppIds(
  key: "saved-app-ids" | "received-app-ids",
): string[] {
  const unparsedSavedAppsIds = localStorage.getItem(key);
  return unparsedSavedAppsIds === null
    ? []
    : (JSON.parse(unparsedSavedAppsIds) as string[]);
}

export function appendSavedAppIds(
  key: "saved-app-ids" | "received-app-ids",
  extraAppIds: string[],
) {
  const prevAppIds = getSavedAppIds(key);
  const nextAppIds: Set<string> = new Set([...prevAppIds, ...extraAppIds]);
  localStorage.setItem(key, JSON.stringify(Array.from(nextAppIds)));
}

export function resetSavedAppIds(key: "saved-app-ids" | "received-app-ids") {
  localStorage.removeItem(key);
}
