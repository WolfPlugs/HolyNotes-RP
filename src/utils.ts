import { settings } from "replugged";
import type { ModuleExports, ModuleExportsWithProps } from "replugged/dist/types";

export const defaultSettings: Record<string, Record<string, HolyNotes.Note>> = {
  Main: {},
};

export const noteFiles = await settings.init("notes", defaultSettings);

export function getExportsForProto<
  P extends string = string,
  T extends ModuleExportsWithProps<P> = ModuleExportsWithProps<P>,
>(m: ModuleExports, props: P[]): T | undefined {
  // eslint-disable-next-line no-undefined
  if (typeof m !== "object") return undefined;
  return Object.values(m).find((o) => {
    return (
      typeof o === "function" && o != null && o.prototype && props.every((p) => p in o.prototype)
    );
  }) as T | undefined;
}
