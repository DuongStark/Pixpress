const { presets } = require("../config/presets");
const { HttpError } = require("../middlewares/error.middleware");

function listPresets(group) {
  if (!group) {
    return presets;
  }

  return presets.filter((preset) => preset.group === group);
}

function getPresetById(presetId) {
  const preset = presets.find((item) => item.presetId === presetId);

  if (!preset) {
    throw new HttpError(404, "Preset not found.");
  }

  return preset;
}

function resolveProcessOptions({ presetId, overrides = {} } = {}) {
  const basePreset = presetId ? getPresetById(presetId) : null;
  const defaults = basePreset ? basePreset.defaults || {} : {};
  const resolved = {
    ...defaults,
    ...overrides,
  };

  if (defaults.resize || overrides.resize) {
    resolved.resize = {
      ...(defaults.resize || {}),
      ...(overrides.resize || {}),
    };
  }

  if (defaults.background || overrides.background) {
    resolved.background = {
      ...(defaults.background || {}),
      ...(overrides.background || {}),
    };
  }

  if (presetId) {
    resolved.presetId = presetId;
  }

  return resolved;
}

module.exports = {
  listPresets,
  getPresetById,
  resolveProcessOptions,
};
