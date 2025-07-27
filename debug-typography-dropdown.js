// Debug script for typography font-family dropdown
// Add this to your browser console to test the dropdown functionality

console.log("🔍 Debugging Typography Font Family Dropdown...");

// Check if elements exist
function checkElements() {
  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );
  const fontNameLabel = document.getElementById("scTypographyFontName");

  console.log("📋 Element Check:");
  console.log("- Font Select:", fontSelect ? "✅ Found" : "❌ Not found");
  console.log(
    "- Font Family Options:",
    fontFamilyOptions ? "✅ Found" : "❌ Not found"
  );
  console.log(
    "- Font Name Label:",
    fontNameLabel ? "✅ Found" : "❌ Not found"
  );

  if (fontFamilyOptions) {
    console.log("- Dropdown classes:", fontFamilyOptions.className);
    console.log(
      "- Dropdown hidden:",
      fontFamilyOptions.classList.contains("sc-hidden")
    );
    console.log("- Dropdown children:", fontFamilyOptions.children.length);
  }

  return { fontSelect, fontFamilyOptions, fontNameLabel };
}

// Test dropdown toggle
function testDropdownToggle() {
  const { fontSelect, fontFamilyOptions } = checkElements();

  if (!fontSelect || !fontFamilyOptions) {
    console.error("❌ Required elements not found");
    return;
  }

  console.log("🧪 Testing dropdown toggle...");

  // Simulate click
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  fontSelect.dispatchEvent(clickEvent);

  // Check result after a short delay
  setTimeout(() => {
    const isHidden = fontFamilyOptions.classList.contains("sc-hidden");
    console.log("📊 Toggle result:", isHidden ? "Hidden" : "Visible");
  }, 100);
}

// Manual dropdown toggle
function toggleDropdown() {
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (!fontFamilyOptions) {
    console.error("❌ Font family options not found");
    return;
  }

  const isHidden = fontFamilyOptions.classList.contains("sc-hidden");

  if (isHidden) {
    fontFamilyOptions.classList.remove("sc-hidden");
    console.log("✅ Dropdown shown manually");
  } else {
    fontFamilyOptions.classList.add("sc-hidden");
    console.log("✅ Dropdown hidden manually");
  }
}

// Test event listeners
function testEventListeners() {
  const fontSelect = document.getElementById("scFontSelect");

  if (!fontSelect) {
    console.error("❌ Font select not found");
    return;
  }

  console.log("🎧 Testing event listeners...");

  // Add a test listener
  fontSelect.addEventListener(
    "click",
    (e) => {
      console.log("🎯 Test click event fired!");
    },
    { once: true }
  );

  console.log("✅ Test event listener added");
}

// Check CSS styles
function checkStyles() {
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (!fontFamilyOptions) {
    console.error("❌ Font family options not found");
    return;
  }

  const styles = window.getComputedStyle(fontFamilyOptions);

  console.log("🎨 CSS Styles:");
  console.log("- Display:", styles.display);
  console.log("- Opacity:", styles.opacity);
  console.log("- Max-height:", styles.maxHeight);
  console.log("- Overflow:", styles.overflow);
  console.log("- Visibility:", styles.visibility);
  console.log("- Z-index:", styles.zIndex);
}

// Test the new implementation
function testNewImplementation() {
  console.log("🧪 Testing new typography implementation...");

  // Import and test the handler
  import("./src/All/handleAllFontFamily.js")
    .then((module) => {
      const { handleAllFontFamilyClick } = module;

      // Create test context
      const testContext = {
        lastClickedElement: document.querySelector('[id^="block-"]'),
        selectedSingleTextType: "paragraph1",
        addPendingModification: (blockId, modifications) => {
          console.log("Test modification:", { blockId, modifications });
        },
      };

      // Test the handler
      handleAllFontFamilyClick(null, testContext);

      console.log("✅ New implementation test completed");
    })
    .catch((err) => {
      console.error("❌ Failed to test new implementation:", err);
    });
}

// Initialize debug functions
console.log("🚀 Debug functions available:");
console.log("- checkElements() - Check if required elements exist");
console.log("- testDropdownToggle() - Test the dropdown toggle functionality");
console.log("- toggleDropdown() - Manually toggle the dropdown");
console.log("- testEventListeners() - Test event listener attachment");
console.log("- checkStyles() - Check CSS styles affecting the dropdown");
console.log("- testNewImplementation() - Test the new implementation");

// Auto-run initial check
checkElements();
