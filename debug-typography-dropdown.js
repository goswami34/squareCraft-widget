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

// Check widget loading
function checkWidgetLoading() {
  console.log("🔍 Checking widget loading...");

  // Check if widget container exists
  const widgetContainer = document.querySelector(
    '[id*="widget"], [class*="widget"], [id*="squarecraft"], [class*="squarecraft"]'
  );
  console.log(
    "- Widget container:",
    widgetContainer ? "✅ Found" : "❌ Not found"
  );

  // Check for typography section
  const typoSection = document.getElementById("typoSection");
  console.log(
    "- Typography section:",
    typoSection ? "✅ Found" : "❌ Not found"
  );

  // Check for heading dropdowns
  const headingDropdowns = document.querySelectorAll(
    '[id*="heading"][id*="Dropdown"]'
  );
  console.log("- Heading dropdowns found:", headingDropdowns.length);

  // Check for font select elements
  const fontSelects = document.querySelectorAll(
    '[id*="FontSelect"], [id*="fontSelect"]'
  );
  console.log("- Font select elements found:", fontSelects.length);

  // Check for font family options
  const fontFamilyOptions = document.querySelectorAll(
    '[id*="FontFamilyOptions"], [id*="fontFamilyOptions"]'
  );
  console.log("- Font family options found:", fontFamilyOptions.length);

  return {
    widgetContainer,
    typoSection,
    headingDropdowns,
    fontSelects,
    fontFamilyOptions,
  };
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

// Force widget reload
function forceWidgetReload() {
  console.log("🔄 Forcing widget reload...");

  // Remove existing widget
  const existingWidget = document.querySelector(
    '[id*="widget"], [class*="widget"], [id*="squarecraft"], [class*="squarecraft"]'
  );
  if (existingWidget) {
    existingWidget.remove();
    console.log("✅ Removed existing widget");
  }

  // Trigger widget creation
  if (window.squareCraft && typeof window.squareCraft === "function") {
    window.squareCraft();
    console.log("✅ Triggered widget creation");
  } else {
    console.log("⚠️ squareCraft function not found");
  }
}

// Initialize debug functions
console.log("🚀 Debug functions available:");
console.log("- checkElements() - Check if required elements exist");
console.log("- checkWidgetLoading() - Check widget loading status");
console.log("- testDropdownToggle() - Test the dropdown toggle functionality");
console.log("- toggleDropdown() - Manually toggle the dropdown");
console.log("- testEventListeners() - Test event listener attachment");
console.log("- checkStyles() - Check CSS styles affecting the dropdown");
console.log("- testNewImplementation() - Test the new implementation");
console.log("- forceWidgetReload() - Force widget reload");

// Auto-run initial checks
console.log("🔍 Running initial checks...");
checkElements();
checkWidgetLoading();
