// Complete Icon Workflow Test Script
// Run this in the browser console to test the entire icon functionality

function testCompleteIconWorkflow() {
  console.log("🧪 Testing Complete Icon Workflow...");
  
  // Test 1: Check if all required functions are available
  console.log("1. Checking required functions...");
  
  const requiredFunctions = [
    'addPendingModification',
    'saveButtonIconModifications',
    'showNotification'
  ];
  
  const missingFunctions = requiredFunctions.filter(func => typeof window[func] !== 'function');
  
  if (missingFunctions.length > 0) {
    console.error("❌ Missing required functions:", missingFunctions);
    return;
  }
  
  console.log("✅ All required functions found");
  
  // Test 2: Check if icon controls exist in DOM
  console.log("2. Checking icon controls in DOM...");
  
  const iconControls = [
    "imageupload",
    "buttonIconSolidoptions",
    "buttonIconOutlineoptions",
    "buttoniconPositionSection",
    "buttonIconRotationradiusBullet",
    "buttonIconSizeradiusBullet",
    "buttonIconSpacingradiusBullet"
  ];
  
  const missingControls = iconControls.filter(id => !document.getElementById(id));
  
  if (missingControls.length > 0) {
    console.warn("⚠️ Missing icon controls:", missingControls);
  } else {
    console.log("✅ All icon controls found");
  }
  
  // Test 3: Check localStorage values
  console.log("3. Checking localStorage values...");
  
  const requiredStorage = ['sc_u_id', 'sc_auth_token', 'sc_w_id'];
  const missingStorage = requiredStorage.filter(key => !localStorage.getItem(key));
  
  if (missingStorage.length > 0) {
    console.error("❌ Missing localStorage values:", missingStorage);
    return;
  }
  
  console.log("✅ All localStorage values found");
  
  // Test 4: Check for pageId
  console.log("4. Checking pageId...");
  
  const pageId = document.querySelector("article[data-page-sections]")?.getAttribute("data-page-sections");
  if (!pageId) {
    console.error("❌ No pageId found");
    return;
  }
  
  console.log("✅ PageId found:", pageId);
  
  // Test 5: Simulate icon upload workflow
  console.log("5. Testing icon upload workflow...");
  
  const testBlockId = "test-icon-block-" + Date.now();
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
    
    // Check if it was added to pendingModifications
    if (window.pendingModifications && window.pendingModifications.has(testBlockId)) {
      const modifications = window.pendingModifications.get(testBlockId);
      console.log("✅ Modification found in pendingModifications:", modifications.length);
      
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
    console.error("❌ Error adding test upload modification:", error);
  }
  
  // Test 6: Simulate icon library selection
  console.log("6. Testing icon library selection...");
  
  const testLibraryPayload = {
    icon: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        width: "20px",
        height: "auto"
      },
      iconData: {
        type: "library",
        src: "https://example.com/icon.svg",
        fileName: "icon.svg"
      }
    },
    buttonType: "primary",
    applyToAllTypes: false
  };
  
  try {
    window.addPendingModification(testBlockId, testLibraryPayload, "buttonIcon");
    console.log("✅ Successfully added test library modification");
  } catch (error) {
    console.error("❌ Error adding test library modification:", error);
  }
  
  // Test 7: Test icon modifications (rotation, size, color)
  console.log("7. Testing icon modifications...");
  
  const testModifications = [
    {
      name: "Rotation",
      payload: {
        icon: {
          selector: ".sqs-button-element--primary .sqscraft-button-icon",
          styles: { transform: "rotate(45deg)" }
        },
        buttonType: "primary",
        applyToAllTypes: false
      }
    },
    {
      name: "Size",
      payload: {
        icon: {
          selector: ".sqs-button-element--primary .sqscraft-button-icon",
          styles: { width: "24px", height: "auto" }
        },
        buttonType: "primary",
        applyToAllTypes: false
      }
    },
    {
      name: "Color",
      payload: {
        icon: {
          selector: ".sqs-button-element--primary .sqscraft-button-icon",
          styles: { color: "#ff0000", fill: "#ff0000" }
        },
        buttonType: "primary",
        applyToAllTypes: false
      }
    }
  ];
  
  testModifications.forEach(({ name, payload }) => {
    try {
      window.addPendingModification(testBlockId, payload, "buttonIcon");
      console.log(`✅ Successfully added ${name} modification`);
    } catch (error) {
      console.error(`❌ Error adding ${name} modification:`, error);
    }
  });
  
  // Test 8: Test database save
  console.log("8. Testing database save...");
  
  const testSavePayload = {
    icon: {
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
  
  // Test the save function directly
  window.saveButtonIconModifications(testBlockId, testSavePayload)
    .then(result => {
      console.log("✅ Database save result:", result);
    })
    .catch(error => {
      console.error("❌ Database save error:", error);
    });
  
  console.log("🏁 Complete Icon Workflow Test Finished");
  console.log("📊 Total pending modifications:", window.pendingModifications ? window.pendingModifications.size : 0);
}

// Test function to simulate actual icon upload
function testActualIconUpload() {
  console.log("📤 Testing Actual Icon Upload...");
  
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton) {
    console.error("❌ Upload button not found");
    return;
  }
  
  console.log("✅ Upload button found, simulating click...");
  
  // Create a test file
  const testFile = new File(
    ['<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2L13.09 6.26L19.09 7.26L15 12.26L16.18 18.26L10 15.76L3.82 18.26L4 12.26L1 7.26L7.09 6.26L10 2Z" fill="#000"/></svg>'],
    'test-icon.svg',
    { type: 'image/svg+xml' }
  );
  
  // Create a file input and trigger the upload
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  
  // Simulate file selection
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(testFile);
  fileInput.files = dataTransfer.files;
  
  // Trigger change event
  const changeEvent = new Event('change', { bubbles: true });
  fileInput.dispatchEvent(changeEvent);
  
  console.log("✅ File upload simulation completed");
  
  // Clean up
  setTimeout(() => {
    if (fileInput.parentNode) {
      fileInput.parentNode.removeChild(fileInput);
    }
  }, 1000);
}

// Run the tests
console.log("🚀 Starting Icon Workflow Tests...");
testCompleteIconWorkflow();

// Uncomment the line below to test actual file upload simulation
// testActualIconUpload(); 