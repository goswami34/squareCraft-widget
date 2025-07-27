import { TypographyModification } from "../models/TypographyModification.js";

export const saveTypographyAllModifications = async (req, res) => {
  const { userId, token, widgetId, pageId, elementId, css, textType } =
    req.body;

  if (
    !userId ||
    !token ||
    !widgetId ||
    !pageId ||
    !elementId ||
    !css ||
    !textType
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: userId, token, widgetId, pageId, elementId, css, textType",
    });
  }

  // ✅ Map frontend text types to model properties
  const textTypeMap = {
    all: "all",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
    paragraph1: "p1",
    paragraph2: "p2",
    paragraph3: "p3",
  };

  const modelTextType = textTypeMap[textType];
  if (!modelTextType) {
    return res.status(400).json({
      message: `Invalid text type: ${textType}. Valid types are: ${Object.keys(
        textTypeMap
      ).join(", ")}`,
    });
  }

  // ✅ Clean and validate CSS data
  let cleanedCss = { selector: null, styles: {} };

  if (typeof css === "object" && css !== null) {
    // Handle both direct styles and nested styles object
    const styles = css.styles || css;

    if (typeof styles === "object" && styles !== null) {
      cleanedCss = {
        selector: css.selector || null,
        styles: Object.fromEntries(
          Object.entries(styles).filter(
            ([_, val]) =>
              val !== null && val !== undefined && val !== "" && val !== "null"
          )
        ),
      };
    }
  }

  // ✅ Validation: make sure at least one style exists
  if (Object.keys(cleanedCss.styles).length === 0) {
    return res.status(400).json({ message: "No valid CSS styles to save." });
  }

  try {
    let existing = await TypographyModification.findOne({ userId, widgetId });

    const newElement = {
      elementId,
      css: {
        all: {},
        h1: {},
        h2: {},
        h3: {},
        h4: {},
        p1: {},
        p2: {},
        p3: {},
        [modelTextType]: cleanedCss, // Set the specific text type CSS
      },
    };

    if (!existing) {
      const newRecord = new TypographyModification({
        userId,
        token,
        widgetId,
        modifications: [
          {
            pageId,
            elements: [newElement],
          },
        ],
      });

      await newRecord.save();
      return res
        .status(201)
        .json({ message: "Typography modifications saved.", data: newRecord });
    }

    // 🔄 Update existing record
    const pageMod = existing.modifications.find((mod) => mod.pageId === pageId);
    if (pageMod) {
      const elementMod = pageMod.elements.find(
        (el) => el.elementId === elementId
      );
      if (elementMod) {
        // Update the specific text type CSS
        elementMod.css[modelTextType] = cleanedCss;
      } else {
        pageMod.elements.push(newElement);
      }
    } else {
      existing.modifications.push({
        pageId,
        elements: [newElement],
      });
    }

    existing.updatedAt = new Date();
    await existing.save();

    return res
      .status(200)
      .json({ message: "Typography modifications updated.", data: existing });
  } catch (err) {
    console.error("❌ Failed to save typography styles:", err.message);
    return res.status(500).json({
      message: "Server error while saving typography modifications.",
      error: err.message,
    });
  }
};

// ✅ Get typography modifications for a specific widget
export const getTypographyModifications = async (req, res) => {
  const { userId, widgetId } = req.params;

  if (!userId || !widgetId) {
    return res.status(400).json({
      message: "Missing required fields: userId, widgetId",
    });
  }

  try {
    const typographyMod = await TypographyModification.findOne({
      userId,
      widgetId,
    });

    if (!typographyMod) {
      return res.status(404).json({
        message: "No typography modifications found for this widget.",
      });
    }

    return res.status(200).json({
      message: "Typography modifications retrieved successfully.",
      data: typographyMod,
    });
  } catch (err) {
    console.error("❌ Failed to get typography modifications:", err.message);
    return res.status(500).json({
      message: "Server error while retrieving typography modifications.",
      error: err.message,
    });
  }
};

// ✅ Delete typography modifications for a specific widget
export const deleteTypographyModifications = async (req, res) => {
  const { userId, widgetId } = req.params;

  if (!userId || !widgetId) {
    return res.status(400).json({
      message: "Missing required fields: userId, widgetId",
    });
  }

  try {
    const result = await TypographyModification.deleteOne({ userId, widgetId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "No typography modifications found to delete.",
      });
    }

    return res.status(200).json({
      message: "Typography modifications deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Failed to delete typography modifications:", err.message);
    return res.status(500).json({
      message: "Server error while deleting typography modifications.",
      error: err.message,
    });
  }
};
