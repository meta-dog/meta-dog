import { AppVM, CreateReferralVM } from "api";

export type HandleRequestClick = (id: AppVM["id"]) => void;
export type ValidateReferralUrlResult = false | CreateReferralVM;
