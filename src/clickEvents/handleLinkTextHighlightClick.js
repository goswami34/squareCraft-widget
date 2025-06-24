let colorPalette = null;
let colorPickerContext = null;

export function handleLinkTextHighlightClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  // Check if we have a valid lastClickedElement
  if (!lastClickedElement) {
    context.showNotification("Please select a block first", "error");
    return;
  }

  if (!event) {
    event = {
      target: document.getElementById("LinktextHighlightColorPalate"),
    };
  }

  const LinktextHighlightColorPalate = event.target.closest(
    "#LinktextHighlightColorPalate"
  );
  if (!LinktextHighlightColorPalate) return;

  // Create fresh context
  colorPickerContext = {
    ...context,
    lastClickedElement,
    selectedSingleTextType: context.selectedSingleTextType,
  };

  // Create hidden color input if not already created
  if (!colorPalette) {
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scHighlightPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    const widgetContainer = document.getElementById("sc-widget-container");
    if (widgetContainer) {
      widgetContainer.appendChild(colorPalette);
    } else {
      document.body.appendChild(colorPalette);
    }

    colorPalette.addEventListener("input", function (event) {
      const selectedColor = event.target.value;

      if (!colorPickerContext?.lastClickedElement) {
        context.showNotification("Please select a block first", "error");
        return;
      }

      // Update color palette display
      const textHighlightPalate = document.getElementById(
        "LinktextHighlightColorPalate"
      );
      if (textHighlightPalate) {
        textHighlightPalate.style.backgroundColor = selectedColor;
      }

      const LinktextHighlightHtml = document.getElementById(
        "LinktextHighlightHtml"
      );
      if (LinktextHighlightHtml) {
        LinktextHighlightHtml.textContent = selectedColor;
      }

      // Get selected text type
      const selectedTab = document.querySelector(".sc-selected-tab");
      let selectedTextType = null;

      if (selectedTab) {
        if (selectedTab.id.startsWith("heading")) {
          selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
        } else if (selectedTab.id.startsWith("paragraph")) {
          selectedTextType = `paragraph${selectedTab.id.replace(
            "paragraph",
            ""
          )}`;
        }
      }

      if (!selectedTextType && colorPickerContext?.selectedSingleTextType) {
        selectedTextType = colorPickerContext.selectedSingleTextType;
      }

      // Validate that we have a selectedTextType before proceeding
      if (!selectedTextType) {
        context.showNotification("Please select a text type first", "error");
        return;
      }

      // Find the block element
      const block =
        colorPickerContext.lastClickedElement.closest('[id^="block-"]');
      if (!block) {
        context.showNotification("Block not found", "error");
        return;
      }

      // Define selectors for different text types
      const selectorMap = {
        paragraph1: "p.sqsrte-large",
        paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
        paragraph3: "p.sqsrte-small",
        heading1: "h1",
        heading2: "h2",
        heading3: "h3",
        heading4: "h4",
      };

      // Try to get the selector from the map, with fallback to a general selector
      let paragraphSelector = selectorMap[selectedTextType];

      // If no specific selector found, use a general fallback
      if (!paragraphSelector) {
        if (selectedTextType && selectedTextType.startsWith("heading")) {
          paragraphSelector = selectedTextType; // Use the heading tag directly
        } else if (
          selectedTextType &&
          selectedTextType.startsWith("paragraph")
        ) {
          paragraphSelector = "p"; // Use all paragraphs as fallback
        } else {
          paragraphSelector = "p, h1, h2, h3, h4"; // Ultimate fallback
        }
      }

      // Validate that we have a valid selector before proceeding
      if (!paragraphSelector) {
        context.showNotification(
          `Invalid text type: ${selectedTextType}. Please select a valid text type first.`,
          "error"
        );
        return;
      }

      const targetElements = block.querySelectorAll(paragraphSelector);

      if (!targetElements.length) {
        context.showNotification(
          `No ${selectedTextType} found in the block`,
          "error"
        );
        return;
      }

      let LinkFound = false;
      let LinkCount = 0;

      // Find and highlight all bold text
      targetElements.forEach((tag) => {
        const boldElements = tag.querySelectorAll("a");
        if (boldElements.length > 0) {
          LinkFound = true;
          LinkCount += boldElements.length;

          // Create or update style tag for this block's Link tags
          let styleTag = document.getElementById(
            `style-${block.id}-Link-highlight`
          );
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${block.id}-Link-highlight`;
            document.head.appendChild(styleTag);
          }

          // Remove any inline styles from parent elements
          tag.style.backgroundColor = "";

          // Apply highlight color to Link tags using linear gradient
          const cssRule = `#${block.id} ${paragraphSelector} a {
            background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 50%) !important;
          }`;

          styleTag.innerHTML = cssRule;
        }
      });

      if (!LinkFound) {
        context.showNotification(
          `No Link (<a>) text found in ${selectedTextType}. Please add some Link text first.`,
          "info"
        );
        return;
      }

      // Save to backend
      context.addPendingModification(block.id, {
        "background-color": selectedColor,
        target: selectedTextType,
      });

      context.showNotification(
        `✅ Text highlight applied to ${LinkCount} link word(s) in ${selectedTextType}`,
        "success"
      );
    });
  }

  // Open color picker
  setTimeout(() => {
    colorPalette.click();
  }, 50);
}
