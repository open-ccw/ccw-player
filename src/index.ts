import { RenderWebGL } from "@open-ccw/scratch-render";
import VirtualMachine, { Runtime } from "@open-ccw/scratch-vm";
import Storage from "@open-ccw/scratch-storage";
import { decrypt } from "./decryptSb3";
import { LoadOfficialExtEntry } from "./extensionsEntry";
export { ccwApi } from "./ccwApi";

/** RenderedTarget 上存在、但基类 Target 类型缺失的属性。 */
interface DraggableTarget {
  id: string;
  draggable: boolean;
  x: number;
  y: number;
  goToFront(): void;
}

export async function init(
  canvas: HTMLCanvasElement,
  onQuestion: (q: any) => any,
) {
  const renderer = new RenderWebGL(canvas);
  const vm = new VirtualMachine();
  const storage = new Storage();
  vm.start();
  vm.setInEditor(false);
  vm.setIsPlayerOnly(true);
  vm.attachRenderer(renderer);
  // 有些扩展会通过这个获取vm
  const onQuestion_ = function (q: any) {
    return onQuestion.apply({ props: { vm: vm } }, q);
  };
  vm.runtime.addListener("QUESTION", onQuestion_);
  vm.attachStorage(storage);
  const entry = await LoadOfficialExtEntry();
  Object.keys(entry).forEach((k) => {
    vm.runtime.extensionManager!.addOfficialExtensionInfo(entry[k]);
  });
  const { AssetType } = storage;
  storage.addWebStore(
    [
      AssetType.ImageVector,
      AssetType.ImageBitmap,
      AssetType.Sound,
      AssetType.GLSL,
      AssetType.Json,
    ],
    (asset) => {
      return `https://m.ccw.site/user_projects_assets/${asset.assetId}.${asset.dataFormat}`;
    },
    null,
    null,
  );
  attachMouse(canvas, renderer, vm);
  attachKeyboard(canvas, vm);
  vm.runtime.on(Runtime.MONITORS_UPDATE, (state) => {
    console.log(state);
  });
  return { vm };
}

function attachKeyboard(canvas: HTMLCanvasElement, vm: VirtualMachine) {
  // Feed keyboard events as VM I/O events.
  canvas.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    console.info(e);
    vm.postIOData("keyboard", { key: e.key, isDown: true });
    e.preventDefault();
  });
  canvas.addEventListener("keyup", (e) => {
    vm.postIOData("keyboard", { key: e.key, isDown: false });
  });
}

class MouseDragHandler {
  private _draggingId: string | null = null;
  private _draggingStartMousePosition: { x: number; y: number } = {
    x: 0,
    y: 0,
  };
  private _draggingStartSpritePosition: { x: number; y: number } = {
    x: 0,
    y: 0,
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private renderer: RenderWebGL,
    private vm: VirtualMachine,
  ) {}

  /** 将客户区坐标转为 Scratch 舞台坐标(中心为原点, y 向上)。 */
  private _scratchCoordinates(x: number, y: number) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = x - rect.left;
    const clientY = y - rect.top;
    return {
      x: (clientX / rect.width) * 480 - 240,
      y: 180 - (clientY / rect.height) * 360,
    };
  }

  /** 获取可拖动 target(带 RenderedTarget 专有属性)。 */
  private _getDraggableTarget(id: string): DraggableTarget | null {
    const target = this.vm.runtime.getTargetById(id);
    return target as unknown as DraggableTarget | null;
  }

  /** 模仿 Scratch 的 _startDragging,按下时命中选择可拖动的角色。 */
  private _startDragging(x: number, y: number) {
    if (this._draggingId) return;
    const drawableId = this.renderer.pick(x, y, 2, 2);
    if (drawableId === -1 || drawableId === 0) return; // ID_NONE
    const targetId = this.vm.getTargetIdForDrawableId(drawableId);
    if (targetId === null) return;
    const target = this._getDraggableTarget(targetId);
    if (!target || !target.draggable) return;
    target.goToFront();
    this._draggingId = targetId;
    this._draggingStartMousePosition = this._scratchCoordinates(x, y);
    this._draggingStartSpritePosition = { x: target.x, y: target.y };
    this.vm.startDrag(targetId);
  }

  /** 拖动过程中根据鼠标移动量实时更新精灵位置。 */
  private _onMouseMove(x: number, y: number) {
    if (this._draggingId) {
      const currentMousePosition = this._scratchCoordinates(x, y);
      const dx = currentMousePosition.x - this._draggingStartMousePosition.x;
      const dy = currentMousePosition.y - this._draggingStartMousePosition.y;
      const newX = this._draggingStartSpritePosition.x + dx;
      const newY = this._draggingStartSpritePosition.y + dy;
      this.vm.postSpriteInfo(
        {
          x: newX,
          y: newY,
          force: true,
        },
        this._draggingId,
      );
    }
  }

  /** 模仿 Scratch 的 _stopDragging,结束拖动。 */
  private _stopDragging() {
    if (!this._draggingId) return;
    const target = this._getDraggableTarget(this._draggingId);
    if (target) {
      this.vm.postSpriteInfo(
        {
          x: target.x,
          y: target.y,
          force: true,
        },
        this._draggingId,
      );
    }
    this.vm.stopDrag(this._draggingId);
    this._draggingId = null;
  }

  attach() {
    const rect = () => this.canvas.getBoundingClientRect();

    document.addEventListener("mousemove", (e) => {
      const bounds = rect();
      const coordinates = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
        canvasWidth: bounds.width,
        canvasHeight: bounds.height,
      };
      this.vm.postIOData("mouse", coordinates);
      this._onMouseMove(coordinates.x, coordinates.y);
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const bounds = rect();
      const data = {
        isDown: true,
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
        canvasWidth: bounds.width,
        canvasHeight: bounds.height,
      };
      this.vm.postIOData("mouse", data);
      this._startDragging(data.x, data.y);
      e.preventDefault();
    });

    document.addEventListener("mouseup", (e) => {
      const bounds = rect();
      const data = {
        isDown: false,
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
        canvasWidth: bounds.width,
        canvasHeight: bounds.height,
      };
      this.vm.postIOData("mouse", data);
      this._stopDragging();
      e.preventDefault();
    });
  }
}

function attachMouse(
  canvas: HTMLCanvasElement,
  renderer: RenderWebGL,
  vm: VirtualMachine,
) {
  new MouseDragHandler(canvas, renderer, vm).attach();
}

export async function loadProjectURL(
  sb3Url: URL,
  vm: VirtualMachine,
  confirm: (
    args: { id: string; url?: string }[],
  ) => Promise<[true, { id: string; url: string }[]] | [false, null]>,
) {
  vm.clear();
  sb3Url.searchParams.set("t", Date.now().toString());
  const response = await fetch(sb3Url).then((res) => res.arrayBuffer());
  const decrypted = await decrypt(response, sb3Url.pathname.split("/").at(-1)!);
  return vm.loadProject(decrypted, undefined, {
    confirmExtensionsCallBack(info) {
      return Promise.resolve(confirm(info));
    },
    extractProperties: {
      shouldMarkLockDeleteAbility: true,
    },
  });
}

export function updateStageSize(vm: VirtualMachine, w: number, h: number) {
  vm.runtime.stageWidth = w;
  vm.runtime.stageHeight = h;
  vm.runtime.renderer?.setStageSize(-w / 2, w / 2, -h / 2, h / 2);
  vm.runtime.renderer?.resize(w, h);
}
