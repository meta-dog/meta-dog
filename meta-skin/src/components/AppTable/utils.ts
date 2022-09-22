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

export function getSavedAppIds(): string[] {
  const unparsedSavedAppsIds = localStorage.getItem("saved-app-ids");
  return unparsedSavedAppsIds === null
    ? []
    : (JSON.parse(unparsedSavedAppsIds) as string[]);
}

export function appendSavedAppIds(extraAppIds: string[]) {
  const prevAppIds = getSavedAppIds();
  const nextAppIds: string[] = [...prevAppIds, ...extraAppIds];
  localStorage.setItem("saved-app-ids", JSON.stringify(nextAppIds));
}
