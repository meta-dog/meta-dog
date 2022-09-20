import { apps } from "mocks";

import { mapAppAMToVM } from "./mappers";

export default function readApps() {
  return Promise.resolve(apps.map(mapAppAMToVM));
}
