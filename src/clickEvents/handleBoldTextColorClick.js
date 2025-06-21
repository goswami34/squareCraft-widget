let colorPalette = null;
let colorPickerContext = null;

export function handleBoldTextColorClick(
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

  const BoldtextColorPalate = event.target.closest("#BoldtextColorPalate");
  if (!BoldtextColorPalate) return;

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
      const textColorPalate = document.getElementById("BoldtextColorPalate");
      if (textColorPalate) {
        textColorPalate.style.backgroundColor = selectedColor;
      }

      const textColorHtml = document.getElementById("BoldtextcolorHtml");
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

      let boldFound = false;
      let boldCount = 0;

      // Find and color all bold text
      targetElements.forEach((tag) => {
        const boldElements = tag.querySelectorAll("strong");
        if (boldElements.length > 0) {
          boldFound = true;
          boldCount += boldElements.length;

          // Create or update style tag for this block's strong tags
          let styleTag = document.getElementById(`style-${block.id}-strong`);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${block.id}-strong`;
            document.head.appendChild(styleTag);
          }

          // Remove any inline styles from parent elements
          tag.style.color = "";

          // Apply color to strong tags
          const cssRule = `#${block.id} ${paragraphSelector} strong {
            color: ${selectedColor} !important;
          }`;

          styleTag.innerHTML = cssRule;
        }
      });

      if (!boldFound) {
        context.showNotification(
          `No Bold (<strong>) text found in ${selectedTextType}. Please add some Bold text first.`,
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
        `✅ Text color applied to ${boldCount} Bold word(s) in ${selectedTextType}`,
        "success"
      );
    });
  }

  // Open color picker
  setTimeout(() => {
    colorPalette.click();
  }, 50);
}
