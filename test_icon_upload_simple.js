// Simple Icon Upload Test
// Run this in browser console to test the basic workflow

function testIconUploadSimple() {
  console.log("🧪 Simple Icon Upload Test Starting...");
  
  // Step 1: Check if we have a selected element
  console.log("1️⃣ Checking for selected element...");
  
  // Look for any button element that might be selected
  const buttons = document.querySelectorAll('a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary');
  console.log(`Found ${buttons.length} button elements`);
  
  if (buttons.length === 0) {
    console.error("❌ No button elements found. Please select a button first.");
    return;
  }
  
  // Use the first button as our test target
  const testButton = buttons[0];
  const buttonParent = testButton.closest('[id]') || testButton.parentElement;
  console.log("✅ Using button:", testButton);
  console.log("✅ Button parent:", buttonParent);
  
  // Step 2: Check if window.addPendingModification is available
  console.log("2️⃣ Checking window.addPendingModification...");
  
  if (typeof window.addPendingModification === 'function') {
    console.log("✅ window.addPendingModification is available");
  } else {
    console.error("❌ window.addPendingModification is NOT available");
    return;
  }
  
  // Step 3: Test adding a modification directly
  console.log("3️⃣ Testing direct modification addition...");
  
  const testBlockId = buttonParent.id || "test-block-" + Date.now();
  const testPayload = {
    icon: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "20px",
        height: "auto"
      },
      iconData: {
        type: "test",
        src: "test-icon.svg"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testPayload, "buttonIcon");
    console.log("✅ Direct modification added successfully");
    
    // Check if it was added to pendingModifications
    if (window.pendingModifications && window.pendingModifications.has(testBlockId)) {
      const modifications = window.pendingModifications.get(testBlockId);
      console.log(`✅ Found ${modifications.length} modifications for block ${testBlockId}`);
      
      const lastMod = modifications[modifications.length - 1];
      if (lastMod.tagType === "buttonIcon") {
        console.log("✅ Correct tagType found");
        console.log("📋 Modification data:", lastMod.css);
      } else {
        console.error("❌ Wrong tagType:", lastMod.tagType);
      }
    } else {
      console.error("❌ Modification not found in pendingModifications");
    }
  } catch (error) {
    console.error("❌ Error adding modification:", error);
  }
  
  // Step 4: Test saveButtonIconModifications
  console.log("4️⃣ Testing saveButtonIconModifications...");
  
  if (typeof window.saveButtonIconModifications === 'function') {
    console.log("✅ saveButtonIconModifications is available");
    
    window.saveButtonIconModifications(testBlockId, testPayload)
      .then(result => {
        console.log("✅ saveButtonIconModifications result:", result);
      })
      .catch(error => {
        console.error("❌ saveButtonIconModifications error:", error);
      });
  } else {
    console.error("❌ saveButtonIconModifications is NOT available");
  }
  
  // Step 5: Check upload button
  console.log("5️⃣ Checking upload button...");
  
  const uploadButton = document.getElementById("imageupload");
  if (uploadButton) {
    console.log("✅ Upload button found");
    console.log("Upload button dataset:", uploadButton.dataset);
    
    // Check if it has event listeners
    const hasListener = uploadButton.dataset.listener === "true";
    console.log("Has listener attached:", hasListener);
  } else {
    console.error("❌ Upload button not found");
  }
  
  console.log("🏁 Simple Icon Upload Test Complete");
}

// Function to simulate a button selection
function simulateButtonSelection() {
  console.log("🎯 Simulating button selection...");
  
  const buttons = document.querySelectorAll('a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary');
  
  if (buttons.length === 0) {
    console.error("❌ No buttons found to select");
    return;
  }
  
  const button = buttons[0];
  const buttonParent = button.closest('[id]') || button.parentElement;
  
  console.log("✅ Selected button:", button);
  console.log("✅ Button parent:", buttonParent);
  
  // Simulate clicking the button to trigger selection
  button.click();
  
  console.log("✅ Button selection simulated");
}

// Function to check current state
function checkCurrentState() {
  console.log("🔍 Checking Current State...");
  
  console.log("📊 Pending modifications count:", window.pendingModifications ? window.pendingModifications.size : 0);
  
  if (window.pendingModifications && window.pendingModifications.size > 0) {
    window.pendingModifications.forEach((modifications, blockId) => {
      console.log(`📋 Block ${blockId}: ${modifications.length} modifications`);
      modifications.forEach((mod, index) => {
        console.log(`  ${index + 1}. tagType: ${mod.tagType}`);
        if (mod.tagType === "buttonIcon") {
          console.log(`     Icon data:`, mod.css);
        }
      });
    });
  }
  
  console.log("🔍 Current state check complete");
}

// Run the test
console.log("🚀 Starting Simple Icon Upload Test...");
testIconUploadSimple();

// Uncomment to simulate button selection
// simulateButtonSelection();

// Uncomment to check current state
// checkCurrentState(); 