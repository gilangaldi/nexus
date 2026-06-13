/** Patch missing crypto.randomUUID (older browsers / non-secure contexts). */
function makeUuid(): `${string}-${string}-${string}-${string}-${string}` {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as `${string}-${string}-${string}-${string}-${string}`;
}

if (typeof globalThis !== "undefined") {
  const g = globalThis as typeof globalThis & { crypto?: Crypto };
  if (!g.crypto) {
    g.crypto = {} as Crypto;
  }
  if (typeof g.crypto.randomUUID !== "function") {
    g.crypto.randomUUID = makeUuid;
  }
}

export function randomId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return makeUuid();
}
