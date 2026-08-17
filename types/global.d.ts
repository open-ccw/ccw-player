import { ScratchExtWebpackModule } from "../src/extensionsEntry";

declare global {
  interface Window {
    scratchExtensions?: ScratchExtWebpackModule;
  }
}
export {};
