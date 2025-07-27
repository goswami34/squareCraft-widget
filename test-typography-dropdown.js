// Test script for typography dropdown
// Run this in the browser console to test the dropdown

console.log("🧪 Testing Typography Dropdown...");

// Test 1: Check if new typography elements exist
function testNewTypographyElements() {
  console.log("📋 Test 1: Checking new typography elements...");

  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );
  const fontNameLabel = document.getElementById("scTypographyFontName");

  console.log("- scFontSelect:", fontSelect ? "✅ Found" : "❌ Not found");
  console.log(
    "- scTypographyFontFamilyOptions:",
    fontFamilyOptions ? "✅ Found" : "❌ Not found"
  );
  console.log(
    "- scTypographyFontName:",
    fontNameLabel ? "✅ Found" : "❌ Not found"
  );

  if (fontSelect) {
    console.log("- Font select classes:", fontSelect.className);
    console.log(
      "- Font select innerHTML:",
      fontSelect.innerHTML.substring(0, 100) + "..."
    );
  }

  if (fontFamilyOptions) {
    console.log("- Font family options classes:", fontFamilyOptions.className);
    console.log(
      "- Font family options hidden:",
      fontFamilyOptions.classList.contains("sc-hidden")
    );
  }

  return { fontSelect, fontFamilyOptions, fontNameLabel };
}

// Test 2: Check if old font family elements exist (should not exist)
function testOldFontFamilyElements() {
  console.log("📋 Test 2: Checking old font family elements...");

  const oldFontFamily = document.getElementById("squareCraftAllFontFamily");

  console.log(
    "- squareCraftAllFontFamily:",
    oldFontFamily ? "⚠️ Found (old system)" : "✅ Not found (expected)"
  );

  return oldFontFamily;
}

// Test 3: Test dropdown toggle manually
function testDropdownToggle() {
  console.log("📋 Test 3: Testing dropdown toggle...");

  const { fontSelect, fontFamilyOptions } = testNewTypographyElements();

  if (!fontSelect || !fontFamilyOptions) {
    console.error("❌ Cannot test dropdown - elements not found");
    return false;
  }

  // Check initial state
  const isInitiallyHidden = fontFamilyOptions.classList.contains("sc-hidden");
  console.log("- Initial state:", isInitiallyHidden ? "Hidden" : "Visible");

  // Manually toggle
  fontFamilyOptions.classList.toggle("sc-hidden");
  const isNowHidden = fontFamilyOptions.classList.contains("sc-hidden");
  console.log("- After manual toggle:", isNowHidden ? "Hidden" : "Visible");
  console.log(
    "- Manual toggle successful:",
    isInitiallyHidden !== isNowHidden ? "✅ Yes" : "❌ No"
  );

  // Toggle back
  fontFamilyOptions.classList.toggle("sc-hidden");

  return true;
}

// Test 4: Test event listeners
function testEventListeners() {
  console.log("📋 Test 4: Testing event listeners...");

  const { fontSelect } = testNewTypographyElements();

  if (!fontSelect) {
    console.error("❌ Cannot test event listeners - element not found");
    return false;
  }

  // Add test listener
  let testEventFired = false;
  fontSelect.addEventListener(
    "click",
    () => {
      testEventFired = true;
      console.log("🎯 Test event listener fired!");
    },
    { once: true }
  );

  // Trigger click
  fontSelect.click();

  setTimeout(() => {
    console.log(
      "- Event listener test:",
      testEventFired ? "✅ Passed" : "❌ Failed"
    );
  }, 50);

  return true;
}

// Test 5: Test widget loading
function testWidgetLoading() {
  console.log("📋 Test 5: Testing widget loading...");

  const widgetContainer = document.querySelector(
    '[id*="widget"], [class*="widget"], [id*="squarecraft"], [class*="squarecraft"]'
  );
  const typoSection = document.getElementById("typoSection");

  console.log(
    "- Widget container:",
    widgetContainer ? "✅ Found" : "❌ Not found"
  );
  console.log(
    "- Typography section:",
    typoSection ? "✅ Found" : "❌ Not found"
  );

  if (widgetContainer && typoSection) {
    console.log("✅ Widget appears to be loaded correctly");
    return true;
  } else {
    console.log("❌ Widget may not be loaded correctly");
    return false;
  }
}

// Test 6: Test the actual handler function
function testHandlerFunction() {
  console.log("📋 Test 6: Testing handler function...");

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

      console.log("✅ Handler function test completed");
    })
    .catch((err) => {
      console.error("❌ Failed to test handler function:", err);
    });
}

// Test 7: Force widget reload and test
function forceWidgetReload() {
  console.log("📋 Test 7: Force widget reload...");

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

    // Wait and test
    setTimeout(() => {
      console.log("🔄 Testing after widget reload...");
      testNewTypographyElements();
    }, 3000);
  } else {
    console.log("⚠️ squareCraft function not found");
  }
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running all typography dropdown tests...\n");

  const test1 = testNewTypographyElements();
  console.log("");

  const test2 = testOldFontFamilyElements();
  console.log("");

  const test3 = testDropdownToggle();
  console.log("");

  const test4 = testEventListeners();
  console.log("");

  const test5 = testWidgetLoading();
  console.log("");

  testHandlerFunction();
  console.log("");

  console.log("📊 Test Summary:");
  console.log(
    "- New typography elements:",
    test1.fontSelect && test1.fontFamilyOptions
      ? "✅ Working"
      : "❌ Not working"
  );
  console.log(
    "- Old font family system:",
    test2 ? "⚠️ Present" : "✅ Absent (good)"
  );
  console.log("- Dropdown toggle:", test3 ? "✅ Working" : "❌ Not working");
  console.log("- Event listeners:", test4 ? "✅ Working" : "❌ Not working");
  console.log("- Widget loading:", test5 ? "✅ Working" : "❌ Not working");
}

// Initialize debug functions
console.log("🚀 Debug functions available:");
console.log("- testNewTypographyElements() - Check if required elements exist");
console.log("- testOldFontFamilyElements() - Check old system status");
console.log("- testDropdownToggle() - Test manual dropdown toggle");
console.log("- testEventListeners() - Test event listener attachment");
console.log("- testWidgetLoading() - Check widget loading status");
console.log("- testHandlerFunction() - Test the handler function");
console.log("- forceWidgetReload() - Force widget reload");
console.log("- runAllTests() - Run all tests");

// Auto-run tests
runAllTests();
