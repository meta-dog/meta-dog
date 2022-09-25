import { AppVM, CreateReferralVM } from "api";

export type HandleAppClick = (app: AppVM) => void;
export type ValidateReferralUrlResult = false | CreateReferralVM;
