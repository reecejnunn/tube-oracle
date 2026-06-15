import { readFileSync } from "node:fs";

const dataDir = new URL("../../data/", import.meta.url);

export function loadJson(relativePath: string): unknown {
  const text = readFileSync(new URL(relativePath, dataDir), "utf-8");
  const parsed: unknown = JSON.parse(text); // pin to unknown to avoid TS inferring any type
  return parsed;
}
