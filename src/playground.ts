import { init, loadProjectURL } from ".";
import { communityWeb, setRequestUtils } from "@ccw-api/api";
import { requestUtils } from "@ccw-api/request";
import { Runtime } from "@open-ccw/scratch-vm";
setRequestUtils(requestUtils);

const root = document.getElementById("root")!;
const oid = document.getElementById("oid") as HTMLInputElement;
const run = document.getElementById("start") as HTMLButtonElement;
const canvas = document.createElement("canvas");
const { vm } = await init(canvas, (...args) => {
  console.log(args);
});
root.appendChild(canvas);

async function main() {
  const { latestProjectLink } = await communityWeb.getCreationDetail(
    oid.value,
    "",
  );
  vm.on("ASSET_PROGRESS", console.log);
  await loadProjectURL(new URL(latestProjectLink), vm);
  vm.greenFlag();
}

run.onclick = main;
