import { presets } from "../config/presets.js";

export function listPresets(group) {
  if (!group) {
    return presets;
  }

  return presets.filter((preset) => preset.group === group);
}
