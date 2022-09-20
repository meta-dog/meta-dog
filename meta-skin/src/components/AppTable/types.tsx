import { CreateReferralVM } from "api/viewModel";

import { AppVM } from "api";

export type HandleRequestClick = (id: AppVM["id"]) => void;
export type ValidateReferralUrlResult = false | CreateReferralVM;
