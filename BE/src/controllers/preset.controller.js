import { listPresets } from "../services/preset.service.js";
import { validatePresetGroup } from "../validators/preset.validator.js";

function listPresetsHandler(req, res, next) {
  try {
    const group = validatePresetGroup(req.query.group);
    const data = listPresets(group);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export { listPresetsHandler };