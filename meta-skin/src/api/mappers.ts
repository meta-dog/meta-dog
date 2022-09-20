import AppAM from "./apiModel";
import AppVM from "./viewModel";

export default function mapAppAMToVM({ id, name }: AppAM) {
  return { id, name } as AppVM;
}
