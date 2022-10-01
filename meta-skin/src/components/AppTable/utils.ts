import { CreateReferralVM } from "api";

const BASE_URL = "https://www.oculus.com/appreferrals/";

export function validateAdvocateId(advocateId: string | null) {
  if (advocateId === null) return false;
  const hasLengthAndOnlyValidChars =
    advocateId.match(/^[0-9a-zA-Z]{1}[\w.\-_]+$/) !== null;
  if (!hasLengthAndOnlyValidChars) return false;
  const hasDoubleDashOrUnderscore = advocateId.match(/[-_]{2,}/);
  if (hasDoubleDashOrUnderscore) return false;
  return true;
}

export function extractReferral(url: string): false | CreateReferralVM {
  if (url.indexOf(BASE_URL) !== 0) return false;
  const shortenedUrl = url.substring(BASE_URL.length);
  const urlMatch = shortenedUrl.match(
    /^(?<advocateId>[^/]+)\/(?<appId>[0-9]+)/,
  );
  if (urlMatch === null) return false;
  if (urlMatch.groups === undefined) return false;
  const { advocateId, appId } = urlMatch.groups;
  if (advocateId === undefined) return false;
  if (appId === undefined) return false;
  if (!validateAdvocateId(advocateId)) return false;
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

export type BooleanKeys =
  | "referral-dialog-on"
  | "create-referral-dialog-on"
  | "quickstart-on";

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

export function removeAdvocateId() {
  localStorage.removeItem("advocate-id");
}
export function getStoredAdvocateId(): string | null {
  const storedAdvocateId = localStorage.getItem("advocate-id");
  if (validateAdvocateId(storedAdvocateId)) return storedAdvocateId;
  removeAdvocateId();
  return null;
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
