import { settings, webpack } from 'replugged'
import type { ModuleExports, ModuleExportsWithProps } from "replugged/dist/types";

const defaultSettings = 
{
  'Main': {}
}

export const noteFiles = await settings.init('notes', defaultSettings);

const myModule = await webpack.waitForModule(
  webpack.filters.bySource(
    'document.queryCommandEnabled("copy")||document.queryCommandSupported("copy")',
  ),
);

export const MyClipboardUtility: {
  isSupported: boolean;
  copyToClipboard: (content: string) => unknown;
} = {
  copyToClipboard: Object.values(myModule).find((e) => typeof e === "function") as (args: string) => void,
  isSupported: Object.values(myModule).find((e) => typeof e === "boolean") as unknown as boolean,
};

export function getExportsForProto<
  P extends string = string,
  T extends ModuleExportsWithProps<P> = ModuleExportsWithProps<P>,
>(m: ModuleExports, props: P[]): T | undefined {
  if (typeof m !== "object") return undefined;
  return Object.values(m).find((o) => {
    return (
      typeof o === "function" && o != null && o.prototype && props.every((p) => p in o.prototype)
    );
  }) as T | undefined;
}
