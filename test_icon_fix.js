// Test Icon Data Structure Fix
// Run this in browser console to test the corrected data structure

function testIconDataStructure() {
  console.log("🧪 Testing Icon Data Structure Fix...");
  
  // Test 1: Check if functions are available
  console.log("1️⃣ Checking required functions...");
  
  if (typeof window.addPendingModification !== 'function') {
    console.error("❌ window.addPendingModification not available");
    return;
  }
  
  if (typeof window.saveButtonIconModifications !== 'function') {
    console.error("❌ window.saveButtonIconModifications not available");
    return;
  }
  
  console.log("✅ Required functions available");
  
  // Test 2: Test icon upload data structure
  console.log("2️⃣ Testing icon upload data structure...");
  
  const testBlockId = "test-icon-block-" + Date.now();
  const testUploadPayload = {
    iconProperties: {
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
    console.log("✅ Icon upload payload added successfully");
  } catch (error) {
    console.error("❌ Error adding icon upload payload:", error);
  }
  
  // Test 3: Test icon rotation data structure
  console.log("3️⃣ Testing icon rotation data structure...");
  
  const testRotationPayload = {
    iconProperties: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        transform: "rotate(45deg)"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testRotationPayload, "buttonIcon");
    console.log("✅ Icon rotation payload added successfully");
  } catch (error) {
    console.error("❌ Error adding icon rotation payload:", error);
  }
  
  // Test 4: Test icon size data structure
  console.log("4️⃣ Testing icon size data structure...");
  
  const testSizePayload = {
    iconProperties: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "24px",
        height: "auto"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testSizePayload, "buttonIcon");
    console.log("✅ Icon size payload added successfully");
  } catch (error) {
    console.error("❌ Error adding icon size payload:", error);
  }
  
  // Test 5: Test icon color data structure
  console.log("5️⃣ Testing icon color data structure...");
  
  const testColorPayload = {
    iconProperties: {
      selector: ".sqs-button-element--primary svg, .sqs-button-element--primary img",
      styles: {
        color: "#ff0000",
        fill: "#ff0000",
        stroke: "#ff0000"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testColorPayload, "buttonIcon");
    console.log("✅ Icon color payload added successfully");
  } catch (error) {
    console.error("❌ Error adding icon color payload:", error);
  }
  
  // Test 6: Test icon spacing data structure
  console.log("6️⃣ Testing icon spacing data structure...");
  
  const testSpacingPayload = {
    iconProperties: {
      selector: ".sqs-button-element--primary",
      styles: {
        gap: "10px"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testSpacingPayload, "buttonIcon");
    console.log("✅ Icon spacing payload added successfully");
  } catch (error) {
    console.error("❌ Error adding icon spacing payload:", error);
  }
  
  // Test 7: Test database save
  console.log("7️⃣ Testing database save...");
  
  const testSavePayload = {
    iconProperties: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "20px",
        height: "auto",
        transform: "rotate(0deg)"
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
  
  window.saveButtonIconModifications(testBlockId, testSavePayload)
    .then(result => {
      console.log("✅ Database save result:", result);
    })
    .catch(error => {
      console.error("❌ Database save error:", error);
    });
  
  // Test 8: Check pending modifications
  console.log("8️⃣ Checking pending modifications...");
  
  if (window.pendingModifications && window.pendingModifications.has(testBlockId)) {
    const modifications = window.pendingModifications.get(testBlockId);
    console.log(`✅ Found ${modifications.length} modifications for block ${testBlockId}`);
    
    modifications.forEach((mod, index) => {
      if (mod.tagType === "buttonIcon") {
        console.log(`✅ Modification ${index + 1}:`, mod.css);
      }
    });
  } else {
    console.error("❌ No pending modifications found");
  }
  
  console.log("🏁 Icon Data Structure Test Complete");
}

// Run the test
console.log("🚀 Starting Icon Data Structure Test...");
testIconDataStructure(); 