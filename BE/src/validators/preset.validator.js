const { HttpError } = require("../middlewares/error.middleware");

const ALLOWED_GROUPS = new Set(["ecommerce", "social", "website", "personal", "custom"]);

function validatePresetId(presetId) {
  const normalized = String(presetId || "").trim();

  if (!normalized) {
    throw new HttpError(400, "presetId is required.");
  }

  return normalized;
}

function validatePresetGroup(group) {
  if (group === undefined || group === null || group === "") {
    return undefined;
  }

  const normalized = String(group).trim().toLowerCase();

  if (!ALLOWED_GROUPS.has(normalized)) {
    throw new HttpError(400, "Unsupported preset group.");
  }

  return normalized;
}

module.exports = {
  validatePresetId,
  validatePresetGroup,
};
