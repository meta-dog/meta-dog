import { CreateReferralVM } from "api";

import { extractReferral, extractUrls, validateAdvocateId } from "./utils";

interface ExtractReferralData {
  input: string;
  output: false | CreateReferralVM;
}

const extractReferralData: ExtractReferralData[] = [
  {
    input:
      "https://www.meta.com/appreferrals/example-user/1241241241241241/?utm_source=3",
    output: { advocateId: "example-user", appId: "1241241241241241" },
  },
  {
    input:
      "https://www.meta.com/appreferrals/maybe-good-gal/5138511912885491/?utm_source=3",
    output: { advocateId: "maybe-good-gal", appId: "5138511912885491" },
  },
  {
    input:
      "https://www.meta.com/appreferrals/example-user/asdasd/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "https://meta.com/appreferrals/example-user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "https://www.anothermeta.com/appreferrals/example-user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "http://www.anothermeta.com/appreferrals/example-user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "http://anothermeta.com/appreferrals/example-user/1241241241241241/",
    output: false,
  },
];

test.each(extractReferralData)(
  "expects extractReferral($input) to equal $output",
  ({ input, output }) => {
    expect(extractReferral(input)).toEqual(output);
  },
);

interface ExtractUrlData {
  input: string;
  output: string[];
}

const extractUrlData: ExtractUrlData[] = [
  {
    input:
      "URL 1: https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: [
      "https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    ],
  },
  {
    input: `URL 1: https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3
      , URL 2:  https://www.meta.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3
      , NON OCULUS URL: https://www.facebook.com`,
    output: [
      "https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3",
      "https://www.meta.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3",
    ],
  },
  {
    input: `URL 1: https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3
      , URL 2:  https://www.meta.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3
      , NON OCULUS URL: https://www.facebook.com https://www.meta.com/appreferrals/maybe-good-gal/5138511912885491/?utm_source=3`,
    output: [
      "https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3",
      "https://www.meta.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3",
      "https://www.meta.com/appreferrals/maybe-good-gal/5138511912885491/?utm_source=3",
    ],
  },
];

test.each(extractUrlData)(
  "expects extractUrls($input) to equal $output",
  ({ input, output }) => {
    expect(extractUrls(input)).toEqual(output);
  },
);

interface ValidateAdvocateIdData {
  input: string | null;
  output: boolean;
}

// Based off on: https://www.meta.com/en-gb/help/quest/articles/accounts/account-settings-and-management/manage-meta-account/
/* Username requirements:

- Usernames must start with a letter or digit.
- Usernames may be between 2 and 20 characters in length.
- Usernames may include a combination of letters, digits, dashes and underscores, but may not include dashes or underscores consecutively.
- Usernames may not have spaces, slashes or ~~full stops~~.

NOTE: The full stops seem to work

*/
const validateAdvocateIdData: ValidateAdvocateIdData[] = [
  {
    input: "1-true_exampleuser",
    output: true,
  },
  {
    input: "maybe-good-gal",
    output: true,
  },
  {
    input: "cant.stop.me.now",
    output: true,
  },
  {
    input: null,
    output: false,
  },
  {
    input: "1",
    output: false,
  },
  {
    input: "a",
    output: false,
  },
  {
    input: "take/this/fail",
    output: false,
  },
  {
    input: "double__under__fail",
    output: false,
  },
  {
    input: "double--dash--fail",
    output: false,
  },
  {
    input: "fail space user",
    output: false,
  },
  {
    input:
      "https://www.meta.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input: "maybe-evil/not-great-user",
    output: false,
  },
  {
    input: "probablygood?user",
    output: false,
  },
];

test.each(validateAdvocateIdData)(
  "expects validateAdvocateIds($input) to equal $output",
  ({ input, output }) => {
    expect(validateAdvocateId(input)).toEqual(output);
  },
);
