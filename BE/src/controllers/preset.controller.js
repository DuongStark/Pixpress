const { listPresets } = require("../services/preset.service");
const { validatePresetGroup } = require("../validators/preset.validator");

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

module.exports = {
  listPresetsHandler,
};