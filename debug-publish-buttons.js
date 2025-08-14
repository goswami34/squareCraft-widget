// 🔍 Debug Helper for Button Hover Color Publish Buttons
// Run this in your browser console to debug the issue

console.log("🔍 Starting Button Hover Color Debug...");

// Check if pendingModifications exists
console.log("1. Checking pendingModifications:");
console.log("   - window.pendingModifications:", window.pendingModifications);
console.log("   - typeof:", typeof window.pendingModifications);
console.log("   - instanceof Map:", window.pendingModifications instanceof Map);

if (window.pendingModifications) {
  console.log("2. Current pending modifications:");
  const entries = Array.from(window.pendingModifications.entries());
  console.log("   - Total entries:", entries.length);

  if (entries.length > 0) {
    entries.forEach(([blockId, modifications]) => {
      console.log(`   - Block ID: ${blockId}`);
      console.log("     Modifications:", modifications);

      // Check for button hover color modifications
      const textColorMods = modifications.filter(
        (m) => m.tagType === "buttonHoverTextColor"
      );
      const backgroundColorMods = modifications.filter(
        (m) => m.tagType === "buttonHoverBackgroundColor"
      );

      if (textColorMods.length > 0) {
        console.log(`     Text Color Mods: ${textColorMods.length}`);
        textColorMods.forEach((mod, index) => {
          console.log(`       ${index + 1}.`, mod);
        });
      }

      if (backgroundColorMods.length > 0) {
        console.log(
          `     Background Color Mods: ${backgroundColorMods.length}`
        );
        backgroundColorMods.forEach((mod, index) => {
          console.log(`       ${index + 1}.`, mod);
        });
      }
    });
  } else {
    console.log("   - No pending modifications found");
  }
} else {
  console.log("   - ❌ pendingModifications is not defined!");
}

// Check if the required functions exist
console.log("3. Checking required functions:");
console.log(
  "   - saveButtonHoverColorModifications:",
  typeof saveButtonHoverColorModifications
);
console.log("   - addPendingModification:", typeof addPendingModification);

// Check if the publish buttons exist in the DOM
console.log("4. Checking publish buttons in DOM:");
const textColorBtn = document.getElementById("hover-text-color-publish-btn");
const backgroundColorBtn = document.getElementById(
  "hover-background-color-publish-btn"
);

console.log("   - Text Color Publish Button:", textColorBtn);
console.log("   - Background Color Publish Button:", backgroundColorBtn);

if (textColorBtn) {
  console.log("   - Text Color Button HTML:", textColorBtn.outerHTML);
}
if (backgroundColorBtn) {
  console.log(
    "   - Background Color Button HTML:",
    backgroundColorBtn.outerHTML
  );
}

// Check if the color palette containers exist
console.log("5. Checking color palette containers:");
const textColorPalette = document.getElementById(
  "hover-button-text-color-palette"
);
const backgroundColorPalette = document.getElementById(
  "hover-button-background-color-palette"
);

console.log("   - Text Color Palette:", textColorPalette);
console.log("   - Background Color Palette:", backgroundColorPalette);

// Function to manually test adding a modification
window.testAddModification = function (blockId = "test-block-123") {
  console.log("🧪 Testing addPendingModification...");

  if (typeof addPendingModification !== "function") {
    console.error("❌ addPendingModification function not available");
    return;
  }

  const testPayload = {
    buttonPrimary: {
      selector: ".sqs-button-element--primary:hover",
      styles: { color: "rgb(255, 0, 0)" },
    },
    buttonSecondary: {
      selector: ".sqs-button-element--secondary:hover",
      styles: {},
    },
    buttonTertiary: {
      selector: ".sqs-button-element--tertiary:hover",
      styles: {},
    },
  };

  console.log("   - Adding test modification for block:", blockId);
  console.log("   - Payload:", testPayload);

  addPendingModification(blockId, testPayload, "buttonHoverTextColor");

  console.log(
    "   - After adding, pendingModifications:",
    window.pendingModifications
  );
  if (window.pendingModifications && window.pendingModifications.has(blockId)) {
    console.log(
      "   - Modifications for test block:",
      window.pendingModifications.get(blockId)
    );
  }
};

// Function to manually test the save function
window.testSaveModification = function (blockId = "test-block-123") {
  console.log("🧪 Testing saveButtonHoverColorModifications...");

  if (typeof saveButtonHoverColorModifications !== "function") {
    console.error(
      "❌ saveButtonHoverColorModifications function not available"
    );
    return;
  }

  if (
    !window.pendingModifications ||
    !window.pendingModifications.has(blockId)
  ) {
    console.error("❌ No pending modifications found for block:", blockId);
    return;
  }

  const modifications = window.pendingModifications.get(blockId);
  const textColorMods = modifications.filter(
    (m) => m.tagType === "buttonHoverTextColor"
  );

  if (textColorMods.length === 0) {
    console.error("❌ No text color modifications found");
    return;
  }

  console.log("   - Found modifications:", textColorMods);

  // Create CSS payload
  const cssPayload = {
    buttonPrimary: { styles: {} },
    buttonSecondary: { styles: {} },
    buttonTertiary: { styles: {} },
  };

  textColorMods.forEach((mod) => {
    if (mod.css?.buttonPrimary?.styles?.color) {
      cssPayload.buttonPrimary.styles.color =
        mod.css.buttonPrimary.styles.color;
    }
    if (mod.css?.buttonSecondary?.styles?.color) {
      cssPayload.buttonSecondary.styles.color =
        mod.css.buttonSecondary.styles.color;
    }
    if (mod.css?.buttonTertiary?.styles?.color) {
      cssPayload.buttonTertiary.styles.color =
        mod.css.buttonTertiary.styles.color;
    }
  });

  console.log("   - CSS Payload:", cssPayload);

  // Call the save function
  saveButtonHoverColorModifications(blockId, cssPayload)
    .then((result) => {
      console.log("   - Save result:", result);
    })
    .catch((error) => {
      console.error("   - Save error:", error);
    });
};

console.log("🔍 Debug complete! Use these functions to test:");
console.log("   - testAddModification() - Test adding a modification");
console.log("   - testSaveModification() - Test saving a modification");
console.log("   - Check the console output above for issues");
