import { AppVM, CreateReferralVM } from "api";

export type HandleIdClick = (id: AppVM["id"]) => void;
export type ValidateReferralUrlResult = false | CreateReferralVM;
