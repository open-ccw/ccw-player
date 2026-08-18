import { init, loadProjectURL, updateStageSize } from ".";
import { communityWeb, setRequestUtils } from "@ccw-api/api";
import { requestUtils } from "@ccw-api/request";
import VirtualMachine, { Runtime } from "@open-ccw/scratch-vm";
setRequestUtils(requestUtils);

declare global {
  interface Window {
    vm: VirtualMachine;
  }
}

const root = document.getElementById("root")!;
const oid = document.getElementById("oid") as HTMLInputElement;
const run = document.getElementById("start") as HTMLButtonElement;
const canvas = document.createElement("canvas");
const progress = document.getElementById("progress") as HTMLProgressElement;
const { vm } = await init(canvas, (...args) => {
  console.log(args);
});
window.vm = vm;
let w = 640;
let h = 360;
updateStageSize(vm, w, h);
root.appendChild(canvas);

const observer = new ResizeObserver(([e]) => {
  const rect = e.contentRect;
  w = rect.width;
  h = rect.height;
  updateStageSize(vm, w, h);
});
observer.observe(root);

async function main() {
  const { latestProjectLink } = await communityWeb.getCreationDetail(
    oid.value,
    "",
  );
  vm.on(Runtime.ASSET_PROGRESS, (v, t) => {
    progress.value = v;
    progress.max = t;
  });
  await loadProjectURL(new URL(latestProjectLink), vm);
  vm.greenFlag();
}

run.onclick = main;
