// Test script to verify button icon functions are working correctly
// Run this in the browser console after the page loads

function testButtonIconFunctions() {
  console.log("🧪 Testing Button Icon Functions...");
  
  // Test 1: Check if window.addPendingModification is available
  console.log("1. Checking window.addPendingModification...");
  if (typeof window.addPendingModification === "function") {
    console.log("✅ window.addPendingModification is available");
  } else {
    console.error("❌ window.addPendingModification is NOT available");
    return;
  }
  
  // Test 2: Check if saveButtonIconModifications is available
  console.log("2. Checking saveButtonIconModifications...");
  if (typeof window.saveButtonIconModifications === "function") {
    console.log("✅ saveButtonIconModifications is available");
  } else {
    console.error("❌ saveButtonIconModifications is NOT available");
  }
  
  // Test 3: Check if pendingModifications Map exists
  console.log("3. Checking pendingModifications Map...");
  if (window.pendingModifications && window.pendingModifications instanceof Map) {
    console.log("✅ pendingModifications Map exists");
    console.log("📊 Current pending modifications:", window.pendingModifications.size);
  } else {
    console.error("❌ pendingModifications Map is NOT available");
  }
  
  // Test 4: Check if icon functions are properly initialized
  console.log("4. Checking icon function initialization...");
  
  const iconFunctions = [
    "initButtonIconPositionToggle",
    "initButtonIconRotationControl", 
    "initButtonIconSizeControl",
    "initButtonIconSpacingControl",
    "initButtonIconColorPalate",
    "initButtonIconUpload"
  ];
  
  iconFunctions.forEach(funcName => {
    if (typeof window[funcName] === "function") {
      console.log(`✅ ${funcName} is available`);
    } else {
      console.warn(`⚠️ ${funcName} is NOT available`);
    }
  });
  
  // Test 5: Simulate icon modification
  console.log("5. Testing icon modification simulation...");
  
  const testBlockId = "test-block-" + Date.now();
  const testIconPayload = {
    icon: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "24px",
        height: "auto",
        transform: "rotate(45deg)"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testIconPayload, "buttonIcon");
    console.log("✅ Successfully added test icon modification to pendingModifications");
    console.log("📊 Pending modifications count:", window.pendingModifications.size);
    
    // Check if it was added correctly
    const modifications = window.pendingModifications.get(testBlockId);
    if (modifications && modifications.length > 0) {
      const lastMod = modifications[modifications.length - 1];
      console.log("✅ Test modification added with correct tagType:", lastMod.tagType);
      console.log("📋 Test modification data:", lastMod.css);
    } else {
      console.error("❌ Test modification was not added correctly");
    }
    
  } catch (error) {
    console.error("❌ Error adding test modification:", error);
  }
  
  // Test 6: Check if icon controls exist in DOM
  console.log("6. Checking icon controls in DOM...");
  
  const iconControls = [
    "buttoniconPositionSection",
    "buttonIconRotationradiusBullet",
    "buttonIconSizeradiusBullet",
    "buttonIconSpacingradiusBullet",
    "buttonIconUpload",
    "button-icon-color-palette"
  ];
  
  iconControls.forEach(controlId => {
    const element = document.getElementById(controlId);
    if (element) {
      console.log(`✅ ${controlId} found in DOM`);
    } else {
      console.warn(`⚠️ ${controlId} NOT found in DOM`);
    }
  });
  
  console.log("🏁 Button Icon Functions Test Complete");
}

// Test function to simulate icon color change
function testIconColorChange() {
  console.log("🎨 Testing Icon Color Change...");
  
  // Simulate the icon color change process
  const testBlockId = "test-color-block-" + Date.now();
  const testColorPayload = {
    icon: {
      selector: ".sqs-button-element--primary svg, .sqs-button-element--primary svg *",
      styles: {
        color: "rgba(255, 107, 53, 0.8)",
        fill: "rgba(255, 107, 53, 0.8)",
        stroke: "rgba(255, 107, 53, 0.8)"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testColorPayload, "buttonIcon");
    console.log("✅ Successfully added test color modification");
    console.log("📊 Total pending modifications:", window.pendingModifications.size);
  } catch (error) {
    console.error("❌ Error adding test color modification:", error);
  }
}

// Test function to simulate icon upload
function testIconUpload() {
  console.log("📤 Testing Icon Upload...");
  
  const testBlockId = "test-upload-block-" + Date.now();
  const testUploadPayload = {
    icon: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "20px",
        height: "auto"
      },
      iconData: {
        type: "uploaded",
        base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJMMTMuMDkgNi4yNkwxOS4wOSA3LjI2TDE1IDEyLjI2TDE2LjE4IDE4LjI2TDEwIDE1Ljc2TDMuODIgMTguMjZMNCAxMi4yNkwxIDcuMjZMNy4wOSA2LjI2TDEwIDJaIiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPgo=",
        fileName: "test-icon.svg",
        fileSize: 245,
        mimeType: "image/svg+xml"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testUploadPayload, "buttonIcon");
    console.log("✅ Successfully added test upload modification");
    console.log("📊 Total pending modifications:", window.pendingModifications.size);
  } catch (error) {
    console.error("❌ Error adding test upload modification:", error);
  }
}

// Test function to check publish functionality
function testPublishFunctionality() {
  console.log("🚀 Testing Publish Functionality...");
  
  if (window.pendingModifications && window.pendingModifications.size > 0) {
    console.log("📋 Found pending modifications to publish:");
    
    for (const [blockId, modifications] of window.pendingModifications.entries()) {
      console.log(`📦 Block ${blockId}:`, modifications.length, "modifications");
      modifications.forEach((mod, index) => {
        console.log(`  ${index + 1}. Type: ${mod.tagType}, Data:`, mod.css);
      });
    }
    
    // Check if handlePublish function exists
    if (typeof window.handlePublish === "function") {
      console.log("✅ handlePublish function is available");
    } else {
      console.warn("⚠️ handlePublish function is NOT available");
    }
    
  } else {
    console.log("📭 No pending modifications to publish");
  }
}

// Export functions for use
window.testButtonIconFunctions = testButtonIconFunctions;
window.testIconColorChange = testIconColorChange;
window.testIconUpload = testIconUpload;
window.testPublishFunctionality = testPublishFunctionality;

console.log("🔧 Button Icon Test Functions Loaded");
console.log("Available functions:");
console.log("- testButtonIconFunctions() - Test all icon functions");
console.log("- testIconColorChange() - Test icon color modification");
console.log("- testIconUpload() - Test icon upload");
console.log("- testPublishFunctionality() - Test publish functionality"); 