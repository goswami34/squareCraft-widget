// Store pending mask modifications locally
const pendingMaskModifications = new Map();

// Function to merge and save mask styles (similar to border controls)
function mergeAndSaveMaskStyles(blockId, newStyles) {
  console.log("🔄 mergeAndSaveMaskStyles called with:", {
    blockId,
    newStyles,
  });

  // --- Merge with existing styles to prevent overwriting border/overlay ---
  const prevData = window.__scImageStyleMap.get(blockId) || {
    image: {
      selector: `#${blockId} div.sqs-image-content`,
      styles: {},
    },
    imageTag: {
      selector: `#${blockId} .sqs-image-content img`,
      styles: {
        "box-sizing": "border-box",
        "object-fit": "cover",
      },
    },
  };

  // Merge the new mask styles with existing styles
  const mergedImageStyles = {
    ...prevData.image.styles, // Keep existing styles (border, overlay, etc.)
    ...(newStyles.image?.styles || {}), // Add/overwrite with new mask styles
  };

  const mergedImageTagStyles = {
    ...prevData.imageTag.styles, // Keep existing styles
    ...(newStyles.imageTag?.styles || {}), // Add new styles if any
  };

  const finalData = {
    image: {
      selector: prevData.image.selector,
      styles: mergedImageStyles,
    },
    imageTag: {
      selector: prevData.imageTag.selector,
      styles: mergedImageTagStyles,
    },
  };

  // Save to map and pendingModifications only (no DB call)
  window.__scImageStyleMap.set(blockId, finalData);
  pendingMaskModifications.set(blockId, finalData);

  console.log("💾 Saved mask to pending modifications (merged):", {
    blockId,
    finalData,
    pendingCount: pendingMaskModifications.size,
  });
}

// Function to reset mask styles
function resetMaskStyles(blockId) {
  const imageContentDiv = document.querySelector(
    `#${blockId} div.sqs-image-content`
  );
  if (!imageContentDiv) return;

  // Remove mask styles from DOM
  imageContentDiv.style.webkitMaskImage = "";
  imageContentDiv.style.maskImage = "";
  imageContentDiv.style.maskRepeat = "";
  imageContentDiv.style.maskSize = "";
  imageContentDiv.style.maskPosition = "";
  imageContentDiv.style.webkitMaskRepeat = "";
  imageContentDiv.style.webkitMaskSize = "";
  imageContentDiv.style.webkitMaskPosition = "";
  imageContentDiv.style.transition = "";

  // Save reset to pending modifications
  mergeAndSaveMaskStyles(blockId, {
    image: {
      selector: `#${blockId} div.sqs-image-content`,
      styles: {
        "-webkit-mask-image": "none",
        "mask-image": "none",
        "mask-repeat": "initial",
        "mask-size": "initial",
        "mask-position": "initial",
        "-webkit-mask-repeat": "initial",
        "-webkit-mask-size": "initial",
        "-webkit-mask-position": "initial",
        transition: "initial",
      },
    },
  });

  console.log("🔄 Reset mask styles for block:", blockId);
}

// Function to restore mask styles from database
function restoreMaskStyles(blockId, maskStyles) {
  const imageContentDiv = document.querySelector(
    `#${blockId} div.sqs-image-content`
  );
  if (!imageContentDiv) return;

  // Apply mask styles to the DOM
  if (
    maskStyles["-webkit-mask-image"] &&
    maskStyles["-webkit-mask-image"] !== "none"
  ) {
    imageContentDiv.style.webkitMaskImage = maskStyles["-webkit-mask-image"];
    imageContentDiv.style.maskImage =
      maskStyles["mask-image"] || maskStyles["-webkit-mask-image"];
    imageContentDiv.style.maskRepeat = maskStyles["mask-repeat"] || "no-repeat";
    imageContentDiv.style.maskSize = maskStyles["mask-size"] || "contain";
    imageContentDiv.style.maskPosition =
      maskStyles["mask-position"] || "center";
    imageContentDiv.style.webkitMaskRepeat =
      maskStyles["-webkit-mask-repeat"] || "no-repeat";
    imageContentDiv.style.webkitMaskSize =
      maskStyles["-webkit-mask-size"] || "contain";
    imageContentDiv.style.webkitMaskPosition =
      maskStyles["-webkit-mask-position"] || "center";
    imageContentDiv.style.transition =
      maskStyles["transition"] ||
      "mask-image 0.3s ease, -webkit-mask-image 0.3s ease";

    console.log("🎭 Restored mask styles for block:", blockId, maskStyles);
  } else {
    // Clear mask styles if none or "none"
    imageContentDiv.style.webkitMaskImage = "";
    imageContentDiv.style.maskImage = "";
    imageContentDiv.style.maskRepeat = "";
    imageContentDiv.style.maskSize = "";
    imageContentDiv.style.maskPosition = "";
    imageContentDiv.style.webkitMaskRepeat = "";
    imageContentDiv.style.webkitMaskSize = "";
    imageContentDiv.style.webkitMaskPosition = "";
    imageContentDiv.style.transition = "";

    console.log("🎭 Cleared mask styles for block:", blockId);
  }
}

// Function to publish all pending mask modifications
const publishPendingMaskModifications = async (saveModificationsforImage) => {
  if (pendingMaskModifications.size === 0) {
    console.log("No mask changes to publish");
    return;
  }

  try {
    for (const [blockId, maskData] of pendingMaskModifications) {
      if (typeof saveModificationsforImage === "function") {
        console.log("Publishing mask for block:", blockId, maskData);
        await saveModificationsforImage(blockId, maskData, "image");
      }
    }

    // Clear pending modifications after successful publish
    pendingMaskModifications.clear();
    console.log("All mask changes published successfully!");
  } catch (error) {
    console.error("Failed to publish mask modifications:", error);
    throw error;
  }
};

export function initImageMaskControls(selectedElementRef, context = {}) {
  const { saveModificationsforImage } = context;

  // Add publish button handler for mask controls
  const publishButton = document.getElementById("publish");
  if (publishButton) {
    // Remove existing listener to avoid duplicates
    publishButton.removeEventListener(
      "click",
      publishButton.maskPublishHandler
    );

    // Create new handler
    publishButton.maskPublishHandler = async () => {
      try {
        await publishPendingMaskModifications(saveModificationsforImage);
      } catch (error) {
        console.error("Mask publish error:", error);
      }
    };

    // Add the handler
    publishButton.addEventListener("click", publishButton.maskPublishHandler);
  }

  // Add reset button handler
  const resetButton = document.querySelector(
    ".sc-bg-454545.sc-gradiant-border"
  );
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const element = selectedElementRef();
      if (!element) return;

      const blockElement = element.closest('[id^="block-"]');
      if (!blockElement) return;

      resetMaskStyles(blockElement.id);
    });
  }

  const thumbs = document.querySelectorAll(".sc-image-mask-thumb");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const maskUrl = thumb.dataset.mask;
      let element = selectedElementRef();

      if (!element || !maskUrl) return;

      // Find the block element
      const blockElement = element.closest('[id^="block-"]');
      if (!blockElement) {
        console.warn("No block element found for mask application");
        return;
      }

      const blockId = blockElement.id;
      let imageContentDiv = element;

      if (element.id && element.id.startsWith("block-")) {
        imageContentDiv = element.querySelector(".sqs-image-content");
        if (!imageContentDiv) {
          console.warn("No .sqs-image-content found in block");
          return;
        }
      }

      // Apply mask styles to the element
      imageContentDiv.style.webkitMaskImage = `url("${maskUrl}")`;
      imageContentDiv.style.maskImage = `url("${maskUrl}")`;
      imageContentDiv.style.maskRepeat = "no-repeat";
      imageContentDiv.style.maskSize = "contain";
      imageContentDiv.style.maskPosition = "center";
      imageContentDiv.style.webkitMaskRepeat = "no-repeat";
      imageContentDiv.style.webkitMaskSize = "contain";
      imageContentDiv.style.webkitMaskPosition = "center";
      imageContentDiv.style.transition =
        "mask-image 0.3s ease, -webkit-mask-image 0.3s ease";

      // Save to pending modifications (not to database yet)
      mergeAndSaveMaskStyles(blockId, {
        image: {
          selector: `#${blockId} div.sqs-image-content`,
          styles: {
            "-webkit-mask-image": `url("${maskUrl}")`,
            "mask-image": `url("${maskUrl}")`,
            "mask-repeat": "no-repeat",
            "mask-size": "contain",
            "mask-position": "center",
            "-webkit-mask-repeat": "no-repeat",
            "-webkit-mask-size": "contain",
            "-webkit-mask-position": "center",
            transition: "mask-image 0.3s ease, -webkit-mask-image 0.3s ease",
          },
        },
      });

      console.log("🎭 Applied mask:", {
        maskUrl,
        blockId,
        element: imageContentDiv,
      });
    });
  });
}

// Export the publish function and restore function for external use
export { publishPendingMaskModifications, restoreMaskStyles };
