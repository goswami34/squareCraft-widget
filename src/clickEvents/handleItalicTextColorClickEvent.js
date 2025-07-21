let colorPalette = null;
let colorPickerContext = null;

export function handleItalicTextColorClickEvent(
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

  const italicTextColorPalate = event.target.closest("#ItalictextColorPalate");
  if (!italicTextColorPalate) return;

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
    colorPalette.id = "scColorPalette";
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
      const textColorPalate = document.getElementById("ItalictextColorPalate");
      if (textColorPalate) {
        textColorPalate.style.backgroundColor = selectedColor;
      }

      const textColorHtml = document.getElementById("ItalictextcolorHtml");
      if (textColorHtml) {
        textColorHtml.textContent = selectedColor;
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

      // if (!selectedTextType) {
      //   context.showNotification("Please select a text type first", "error");
      //   return;
      // }

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

      const paragraphSelector = selectorMap[selectedTextType] || "";
      const targetElements = block.querySelectorAll(paragraphSelector);

      if (!targetElements.length) {
        context.showNotification(
          `No ${selectedTextType} found in the block`,
          "error"
        );
        return;
      }

      let italicFound = false;
      let italicCount = 0;

      // Find and color all italic text
      targetElements.forEach((tag) => {
        const italicElements = tag.querySelectorAll("em");
        if (italicElements.length > 0) {
          italicFound = true;
          italicCount += italicElements.length;

          // Create or update style tag for this block's em tags
          let styleTag = document.getElementById(`style-${block.id}-em`);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${block.id}-em`;
            document.head.appendChild(styleTag);
          }

          // Remove any inline styles from parent elements
          tag.style.color = "";

          // Apply color to em tags
          const cssRule = `#${block.id} ${paragraphSelector} em {
            color: ${selectedColor} !important;
          }`;

          styleTag.innerHTML = cssRule;
        }
      });

      if (!italicFound) {
        context.showNotification(
          `No italic (<em>) text found in ${selectedTextType}. Please add some italic text first.`,
          "info"
        );
        return;
      }

      // Save to backend
      context.addPendingModification(block.id, {
        color: selectedColor,
        target: selectedTextType,
      });

      context.showNotification(
        `✅ Text color applied to ${italicCount} italic word(s) in ${selectedTextType}`,
        "success"
      );
    });
  }

  // Open color picker
  setTimeout(() => {
    colorPalette.click();
  }, 50);
}
