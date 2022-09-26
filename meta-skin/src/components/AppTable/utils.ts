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

export type BooleanKeys = "referral-dialog-on" | "create-referral-dialog-on";

export function storeBoolean(key: BooleanKeys, value: boolean) {
  localStorage.setItem(key, String(value));
}

export function getStoredBoolean(key: BooleanKeys) {
  let value = true;
  const oldValue = localStorage.getItem(key);
  if (oldValue === "false") {
    value = false;
  }
  storeBoolean(key, value);
  return value;
}

export function getStoredAdvocateId(): string | null {
  return localStorage.getItem("advocate-id");
}
export function storeAdvocateId(advocateId: string) {
  localStorage.setItem("advocate-id", advocateId);
}

type ArrayKeys = "saved-app-ids" | "received-app-ids" | "blacklist-ids";

export function getStoredArray(key: ArrayKeys): string[] {
  const unparsedSavedAppsIds = localStorage.getItem(key);
  return unparsedSavedAppsIds === null
    ? []
    : (JSON.parse(unparsedSavedAppsIds) as string[]);
}

export function appendToStoredArray(key: ArrayKeys, extraAppIds: string[]) {
  const prevAppIds = getStoredArray(key);
  const nextAppIds: Set<string> = new Set([...prevAppIds, ...extraAppIds]);
  localStorage.setItem(key, JSON.stringify(Array.from(nextAppIds)));
}
