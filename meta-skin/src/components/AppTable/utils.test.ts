import { CreateReferralVM } from "api/viewModel";

import { extractReferral, extractUrls } from "./utils";

interface ExtractReferralData {
  input: string;
  output: false | CreateReferralVM;
}

const extractReferralData: ExtractReferralData[] = [
  {
    input:
      "https://www.oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: { advocateId: "example.user", appId: "1241241241241241" },
  },
  {
    input:
      "https://www.oculus.com/appreferrals/example.user/asdasd/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "https://oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "https://www.anotheroculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "http://www.anotheroculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: false,
  },
  {
    input:
      "http://anotheroculus.com/appreferrals/example.user/1241241241241241/",
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
      "URL 1: https://www.oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    output: [
      "https://www.oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
    ],
  },
  {
    input: `URL 1: https://www.oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3
      , URL 2:  https://www.oculus.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3
      , NON OCULUS URL: https://www.facebook.com`,
    output: [
      "https://www.oculus.com/appreferrals/example.user/1241241241241241/?utm_source=3",
      "https://www.oculus.com/appreferrals/example.user.potato/1212541241241241/?utm_source=3",
    ],
  },
];

test.each(extractUrlData)(
  "expects extractUrls($input) to equal $output",
  ({ input, output }) => {
    expect(extractUrls(input)).toEqual(output);
  },
);
