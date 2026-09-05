// Some TON libraries expect Node's Buffer/global to exist in the browser.
import { Buffer } from "buffer";

const g = globalThis as unknown as { Buffer?: typeof Buffer; global?: unknown };

if (typeof g.Buffer === "undefined") {
  g.Buffer = Buffer;
}
if (typeof g.global === "undefined") {
  g.global = globalThis;
}

export {};
