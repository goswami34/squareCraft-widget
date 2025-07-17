// Debug script for button icon functionality
// Add this to your browser console to test the button icon save functionality

function debugButtonIconSave() {
  console.log("🔍 Starting button icon debug...");
  
  // Check if required functions exist
  const requiredFunctions = [
    'saveButtonIconModifications',
    'addPendingModification',
    'showNotification'
  ];
  
  const missingFunctions = requiredFunctions.filter(func => typeof window[func] !== 'function');
  
  if (missingFunctions.length > 0) {
    console.error("❌ Missing required functions:", missingFunctions);
    return;
  }
  
  console.log("✅ All required functions found");
  
  // Check localStorage values
  const requiredStorage = ['sc_u_id', 'sc_auth_token', 'sc_w_id'];
  const missingStorage = requiredStorage.filter(key => !localStorage.getItem(key));
  
  if (missingStorage.length > 0) {
    console.error("❌ Missing localStorage values:", missingStorage);
    return;
  }
  
  console.log("✅ All localStorage values found");
  
  // Check for pageId
  const pageId = document.querySelector("article[data-page-sections]")?.getAttribute("data-page-sections");
  if (!pageId) {
    console.error("❌ No pageId found");
    return;
  }
  
  console.log("✅ PageId found:", pageId);
  
  // Test with sample data
  const testData = {
    icon: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "20px",
        height: "auto",
        transform: "rotate(0deg)"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  console.log("🧪 Testing with sample data:", testData);
  
  // Simulate a blockId
  const testBlockId = "test-block-" + Date.now();
  
  // Test the save function
  window.saveButtonIconModifications(testBlockId, testData)
    .then(result => {
      console.log("✅ Save result:", result);
    })
    .catch(error => {
      console.error("❌ Save error:", error);
    });
}

// Function to test pending modifications
function debugPendingModifications() {
  console.log("🔍 Checking pending modifications...");
  
  if (!window.pendingModifications) {
    console.error("❌ No pendingModifications found");
    return;
  }
  
  console.log("📋 Pending modifications:", window.pendingModifications);
  console.log("📊 Size:", window.pendingModifications.size);
  
  for (const [blockId, modifications] of window.pendingModifications.entries()) {
    console.log(`📦 Block ${blockId}:`, modifications);
  }
}

// Function to test button icon upload
function debugButtonIconUpload() {
  console.log("🔍 Testing button icon upload...");
  
  const uploadInput = document.getElementById("buttonIconUpload");
  if (!uploadInput) {
    console.error("❌ No button icon upload input found");
    return;
  }
  
  console.log("✅ Upload input found:", uploadInput);
  
  // Check if event listeners are attached
  const listeners = getEventListeners ? getEventListeners(uploadInput) : "Cannot check (getEventListeners not available)";
  console.log("🎧 Event listeners:", listeners);
}

// Function to check button icon controls
function debugButtonIconControls() {
  console.log("🔍 Checking button icon controls...");
  
  const controls = [
    "buttonIconRotationradiusBullet",
    "buttonIconSizeradiusBullet", 
    "buttonIconSpacingradiusBullet",
    "buttonIconUpload",
    "iconPositionDropdown"
  ];
  
  controls.forEach(controlId => {
    const element = document.getElementById(controlId);
    if (element) {
      console.log(`✅ ${controlId}:`, element);
    } else {
      console.warn(`⚠️ ${controlId}: Not found`);
    }
  });
}

// Main debug function
function runButtonIconDebug() {
  console.log("🚀 Starting comprehensive button icon debug...");
  console.log("=".repeat(50));
  
  debugButtonIconControls();
  console.log("-".repeat(30));
  
  debugPendingModifications();
  console.log("-".repeat(30));
  
  debugButtonIconUpload();
  console.log("-".repeat(30));
  
  debugButtonIconSave();
  console.log("=".repeat(50));
  console.log("🏁 Debug complete");
}

// Export for use
window.runButtonIconDebug = runButtonIconDebug;
window.debugButtonIconSave = debugButtonIconSave;
window.debugPendingModifications = debugPendingModifications;
window.debugButtonIconUpload = debugButtonIconUpload;
window.debugButtonIconControls = debugButtonIconControls;

console.log("🔧 Button icon debug functions loaded. Run 'runButtonIconDebug()' to start debugging."); 