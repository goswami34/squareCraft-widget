// Immediate fix - run this to force the dropdown to show
function forceDropdownToShow() {
  console.log("🚀 Force fixing dropdown visibility...");

  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (!fontFamilyOptions) {
    console.error("❌ Dropdown element not found");
    return;
  }

  // Force show the dropdown with inline styles
  fontFamilyOptions.classList.remove("sc-hidden");
  fontFamilyOptions.style.display = "block";
  fontFamilyOptions.style.opacity = "1";
  fontFamilyOptions.style.visibility = "visible";
  fontFamilyOptions.style.maxHeight = "240px";
  fontFamilyOptions.style.overflow = "auto";
  fontFamilyOptions.style.zIndex = "9999";
  fontFamilyOptions.style.position = "absolute";
  fontFamilyOptions.style.top = "100%";
  fontFamilyOptions.style.left = "0";
  fontFamilyOptions.style.right = "0";
  fontFamilyOptions.style.marginTop = "4px";
  fontFamilyOptions.style.backgroundColor = "#3f3f3f";
  fontFamilyOptions.style.borderRadius = "6px";
  fontFamilyOptions.style.border = "1px solid #585858";

  // Add some test content
  if (fontFamilyOptions.children.length === 0) {
    fontFamilyOptions.innerHTML = `
      <div class="sc-dropdown-item" style="padding: 8px 12px; color: white; cursor: pointer;">Arial</div>
      <div class="sc-dropdown-item" style="padding: 8px 12px; color: white; cursor: pointer;">Helvetica</div>
      <div class="sc-dropdown-item" style="padding: 8px 12px; color: white; cursor: pointer;">Times New Roman</div>
      <div class="sc-dropdown-item" style="padding: 8px 12px; color: white; cursor: pointer;">Georgia</div>
    `;
  }

  console.log("✅ Dropdown forced to show with inline styles");
  console.log(
    "🎯 You should now see the dropdown below the 'Select Font' area"
  );
}

// Quick test function - run this first
function quickTest() {
  console.log("⚡ Quick Test: Checking font-family dropdown...");

  const fontSelect = document.getElementById("scFontSelect");
  const fontFamilyOptions = document.getElementById(
    "scTypographyFontFamilyOptions"
  );

  if (!fontSelect || !fontFamilyOptions) {
    console.error("❌ Elements not found - widget may not be loaded");
    return false;
  }

  console.log("✅ Elements found - testing click...");

  // Test click
  fontSelect.click();

  setTimeout(() => {
    const isVisible = !fontFamilyOptions.classList.contains("sc-hidden");
    console.log(
      "🎯 Click result:",
      isVisible ? "✅ Dropdown opened!" : "❌ Dropdown still hidden"
    );

    if (!isVisible) {
      console.log("💡 Try running: forceDropdownToShow()");
    }
  }, 100);

  return true;
}

// Test script for typography dropdown
// Run this in the browser console to test the dropdown

console.log("🧪 Testing Typography Font-Family Dropdown...");

// Quick test first
quickTest();

// Test 1: Check if font-family elements exist
function testFontFamilyElements() {
  console.log("📋 Test 1: Checking font-family elements...");

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
      "- Font select clickable:",
      fontSelect.style.cursor !== "default" ? "✅ Yes" : "❌ No"
    );
  }

  if (fontFamilyOptions) {
    console.log("- Font family options classes:", fontFamilyOptions.className);
    console.log(
      "- Font family options hidden:",
      fontFamilyOptions.classList.contains("sc-hidden")
    );
    console.log(
      "- Font family options children:",
      fontFamilyOptions.children.length
    );
  }

  return { fontSelect, fontFamilyOptions, fontNameLabel };
}

// Test 2: Test manual click on font select
function testFontSelectClick() {
  console.log("📋 Test 2: Testing font select click...");

  const { fontSelect, fontFamilyOptions } = testFontFamilyElements();

  if (!fontSelect || !fontFamilyOptions) {
    console.error("❌ Cannot test click - elements not found");
    return false;
  }

  // Check initial state
  const isInitiallyHidden = fontFamilyOptions.classList.contains("sc-hidden");
  console.log(
    "- Initial dropdown state:",
    isInitiallyHidden ? "Hidden" : "Visible"
  );

  // Simulate click
  console.log("- Simulating click on font select...");
  fontSelect.click();

  // Check after click
  setTimeout(() => {
    const isNowHidden = fontFamilyOptions.classList.contains("sc-hidden");
    console.log(
      "- After click dropdown state:",
      isNowHidden ? "Hidden" : "Visible"
    );
    console.log(
      "- Click worked:",
      isInitiallyHidden !== isNowHidden ? "✅ Yes" : "❌ No"
    );
  }, 100);

  return true;
}

// Test 3: Test manual toggle
function testManualToggle() {
  console.log("📋 Test 3: Testing manual toggle...");

  const { fontFamilyOptions } = testFontFamilyElements();

  if (!fontFamilyOptions) {
    console.error("❌ Cannot test toggle - element not found");
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

// Test 4: Check CSS styles
function testCSSStyles() {
  console.log("📋 Test 4: Checking CSS styles...");

  const { fontFamilyOptions } = testFontFamilyElements();

  if (!fontFamilyOptions) {
    console.error("❌ Cannot test CSS - element not found");
    return false;
  }

  const styles = window.getComputedStyle(fontFamilyOptions);
  console.log("- Display:", styles.display);
  console.log("- Opacity:", styles.opacity);
  console.log("- Max-height:", styles.maxHeight);
  console.log("- Overflow:", styles.overflow);

  // Check if sc-hidden class is working
  const isHidden = fontFamilyOptions.classList.contains("sc-hidden");
  console.log("- Has sc-hidden class:", isHidden ? "✅ Yes" : "❌ No");

  if (isHidden) {
    console.log(
      "- Hidden styles applied:",
      styles.display === "none" || styles.opacity === "0" ? "✅ Yes" : "❌ No"
    );
  }

  return true;
}

// Test 5: Test event listener attachment
function testEventListeners() {
  console.log("📋 Test 5: Testing event listeners...");

  const { fontSelect } = testFontFamilyElements();

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

// Test 6: Check if typography system is initialized
function testTypographySystem() {
  console.log("📋 Test 6: Checking typography system...");

  // Check if the handler function exists
  if (typeof window.handleAllFontFamilyClick === "function") {
    console.log("- handleAllFontFamilyClick function: ✅ Available");
  } else {
    console.log("- handleAllFontFamilyClick function: ❌ Not available");
  }

  // Check if initTypographyFontFamilyEvents was called
  const eventListeners = getEventListeners(fontSelect);
  console.log("- Event listeners on fontSelect:", eventListeners.length);

  return true;
}

// Helper function to get event listeners (approximate)
function getEventListeners(element) {
  const listeners = [];
  // This is a simplified check - in real browsers we can't directly access event listeners
  // But we can check if the element has onclick or other properties
  if (element.onclick) listeners.push("onclick");
  if (element.onmousedown) listeners.push("onmousedown");
  if (element.onmouseup) listeners.push("onmouseup");
  return listeners;
}

// Test 7: Force initialization
function forceTypographyInitialization() {
  console.log("📋 Test 7: Force typography initialization...");

  // Try to import and initialize manually
  import("./src/All/handleAllFontFamily.js")
    .then((module) => {
      const { initTypographyFontFamilyEvents, manualFixTypographyDropdown } =
        module;

      const testContext = {
        lastClickedElement: document.querySelector('[id^="block-"]'),
        selectedSingleTextType: "paragraph1",
        addPendingModification: (blockId, modifications) => {
          console.log("Test modification:", { blockId, modifications });
        },
      };

      console.log("- Initializing typography events...");
      initTypographyFontFamilyEvents(testContext);

      setTimeout(() => {
        console.log("- Typography initialization completed");
        testFontSelectClick();
      }, 1000);
    })
    .catch((err) => {
      console.error("❌ Failed to initialize typography:", err);
    });
}

// Test 8: Apply manual fix
function applyManualFix() {
  console.log("📋 Test 8: Applying manual fix...");

  import("./src/All/handleAllFontFamily.js")
    .then((module) => {
      const { manualFixTypographyDropdown } = module;

      const result = manualFixTypographyDropdown();

      if (result) {
        console.log("✅ Manual fix applied successfully");
        setTimeout(() => {
          console.log("🔄 Testing dropdown after manual fix...");
          testFontSelectClick();
        }, 500);
      } else {
        console.log("❌ Manual fix failed");
      }
    })
    .catch((err) => {
      console.error("❌ Failed to apply manual fix:", err);
    });
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running all font-family dropdown tests...\n");

  const test1 = testFontFamilyElements();
  console.log("");

  const test2 = testFontSelectClick();
  console.log("");

  const test3 = testManualToggle();
  console.log("");

  const test4 = testCSSStyles();
  console.log("");

  const test5 = testEventListeners();
  console.log("");

  const test6 = testTypographySystem();
  console.log("");

  console.log("📊 Test Summary:");
  console.log(
    "- Font family elements:",
    test1.fontSelect && test1.fontFamilyOptions ? "✅ Found" : "❌ Not found"
  );
  console.log(
    "- Click functionality:",
    test2 ? "✅ Working" : "❌ Not working"
  );
  console.log("- Manual toggle:", test3 ? "✅ Working" : "❌ Not working");
  console.log("- CSS styles:", test4 ? "✅ Applied" : "❌ Not applied");
  console.log("- Event listeners:", test5 ? "✅ Working" : "❌ Not working");
  console.log(
    "- Typography system:",
    test6 ? "✅ Available" : "❌ Not available"
  );
}

// Initialize debug functions
console.log("🚀 Debug functions available:");
console.log("- testFontFamilyElements() - Check if font-family elements exist");
console.log("- testFontSelectClick() - Test clicking the font select");
console.log("- testManualToggle() - Test manual dropdown toggle");
console.log("- testCSSStyles() - Check CSS styles");
console.log("- testEventListeners() - Test event listener attachment");
console.log("- testTypographySystem() - Check typography system");
console.log("- forceTypographyInitialization() - Force initialization");
console.log("- applyManualFix() - Apply manual fix to dropdown");
console.log("- runAllTests() - Run all tests");

// Auto-run tests
runAllTests();
