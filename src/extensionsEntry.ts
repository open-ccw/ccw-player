const staticUrl =
  "https://static.xiguacity.cn/h1t86b7fg6c7k36wnt0cb30m/static/js/main.js?_=1786976304690&t=".concat(
    Date.now().toString(),
  );

export type ScratchExtWebpackModule = {
  __esModule: boolean;
  default(): Promise<any>;
};

export function LoadOfficialExtEntry(): Promise<Record<string, any>> {
  return new Promise(async (res) => {
    Object.defineProperty(window, "scratchExtensions", {
      async set(v: ScratchExtWebpackModule) {
        res((await v.default()).default);
        delete window.scratchExtensions;
      },
      configurable: true,
    });
    await import(/* @vite-ignore */ staticUrl);
  });
}
