export function ButtonTextColorPalate(
  themeColors,
  selectedElement,
  saveButtonTextModifications
) {
  // Use correct IDs matching the HTML
  const palette = document.getElementById("button-text-color-palette");
  const container = document.getElementById("button-text-colors-palette");
  const selectorField = document.getElementById(
    "button-text-border-color-selection-field"
  );
  const bullet = document.getElementById(
    "button-text-border-color-selection-bar"
  );
  const colorCode = document.getElementById("button-text-border-color-code");
  const transparencyCount = document.getElementById(
    "button-text-border-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-text-border-color-all-color-selction-field"
  );
  const allColorBullet = document.getElementById(
    "button-text-border-color-all-color-selction-bar"
  );
  const transparencyField = document.getElementById(
    "button-text-border-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-text-border-color-transparency-bar"
  );

  if (!palette || !container) {
    console.warn("❌ Required palette elements not found");
    return;
  }

  // Clear existing content
  container.innerHTML = "";

  // Add theme colors
  if (themeColors && themeColors.length > 0) {
    themeColors.forEach((color) => {
      const colorSwatch = document.createElement("div");
      colorSwatch.className = "sc-color-swatch";
      colorSwatch.style.backgroundColor = color;
      colorSwatch.style.width = "20px";
      colorSwatch.style.height = "20px";
      colorSwatch.style.margin = "2px";
      colorSwatch.style.cursor = "pointer";
      colorSwatch.style.borderRadius = "2px";

      colorSwatch.addEventListener("click", () => {
        applyButtonTextColor(color, 1);
      });

      container.appendChild(colorSwatch);
    });
  }

  // Add color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.className = "sc-color-picker";
  colorPicker.style.width = "100%";
  colorPicker.style.height = "40px";
  colorPicker.style.marginTop = "10px";
  colorPicker.style.border = "none";
  colorPicker.style.borderRadius = "4px";
  colorPicker.style.cursor = "pointer";

  colorPicker.addEventListener("change", (e) => {
    applyButtonTextColor(e.target.value, 1);
  });

  container.appendChild(colorPicker);

  // Function to apply text color to button
  function applyButtonTextColor(color, alpha = 1) {
    const currentElement = selectedElement?.();
    if (!currentElement) return;

    const buttonTypes = [
      "sqs-button-element--primary",
      "sqs-button-element--secondary",
      "sqs-button-element--tertiary",
    ];

    let buttonType = null;
    for (let type of buttonTypes) {
      if (currentElement.querySelector(`a.${type}`)) {
        buttonType = type;
        break;
      }
    }

    if (!buttonType) {
      console.warn("⚠️ No Squarespace button found in block.");
      return;
    }

    const rgbaColor = color.startsWith("rgb(")
      ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
      : color;

    const styleId = `sc-button-text-color-${buttonType}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // Apply text color to button text elements
    styleTag.innerHTML = `
      .${buttonType} {
        color: ${rgbaColor} !important;
      }
      .${buttonType} span,
      .${buttonType} .sqs-add-to-cart-button-inner {
        color: ${rgbaColor} !important;
      }
    `;

    // Save to pending modifications
    if (typeof saveButtonTextModifications === "function") {
      const blockId = currentElement.id;
      if (blockId) {
        const stylePayload = {
          buttonPrimary: {
            selector: `.${buttonType}`,
            styles: { color: rgbaColor },
          },
        };
        saveButtonTextModifications(blockId, stylePayload);
      }
    }

    console.log("✅ Button text color applied:", rgbaColor);
  }

  // Initialize color picker with current button color
  const currentElement = selectedElement?.();
  if (currentElement) {
    const button = currentElement.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (button) {
      const computedColor = window.getComputedStyle(button).color;
      if (computedColor && computedColor !== "rgba(0, 0, 0, 0)") {
        colorPicker.value = rgbToHex(computedColor);
      }
    }
  }

  // Helper function to convert RGB to Hex
  function rgbToHex(rgb) {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return "#000000";

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
