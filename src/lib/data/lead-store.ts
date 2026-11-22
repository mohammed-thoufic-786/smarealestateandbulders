import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

function fileFor(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readStored<T>(name: string): T[] {
  try {
    const raw = fs.readFileSync(fileFor(name), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeStored<T>(name: string, items: T[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const target = fileFor(name);
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(items, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  fs.renameSync(temp, target);
}
