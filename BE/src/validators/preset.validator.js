import { HttpError } from "../middlewares/error.middleware.js";

const ALLOWED_GROUPS = new Set(["ecommerce", "social", "website", "personal", "custom"]);

export function validatePresetGroup(group) {
  if (group === undefined || group === null || group === "") {
    return undefined;
  }

  const normalized = String(group).trim().toLowerCase();

  if (!ALLOWED_GROUPS.has(normalized)) {
    throw new HttpError(400, "Unsupported preset group.");
  }

  return normalized;
}
