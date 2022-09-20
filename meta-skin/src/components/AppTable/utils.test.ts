import { CreateReferralVM } from "api/viewModel";

import validateReferralUrl from "./utils";

interface ValidateReferralUrlData {
  input: string;
  output: false | CreateReferralVM;
}

const validateReferralUrlData: ValidateReferralUrlData[] = [
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

test.each(validateReferralUrlData)(
  "expects validateReferralUrl($input) to equal $output",
  ({ input, output }) => {
    expect(validateReferralUrl(input)).toEqual(output);
  },
);
