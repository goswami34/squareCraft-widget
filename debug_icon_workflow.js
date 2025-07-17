// Comprehensive Icon Workflow Debug Script
// Run this in browser console to trace the exact issue

function debugIconWorkflow() {
  console.log("🔍 Starting Comprehensive Icon Workflow Debug...");
  
  // Step 1: Check if functions are available
  console.log("1️⃣ Checking function availability...");
  
  const functions = {
    'window.addPendingModification': typeof window.addPendingModification,
    'window.saveButtonIconModifications': typeof window.saveButtonIconModifications,
    'window.showNotification': typeof window.showNotification,
    'window.pendingModifications': window.pendingModifications ? 'Map' : 'undefined'
  };
  
  Object.entries(functions).forEach(([name, type]) => {
    if (type === 'function' || type === 'Map') {
      console.log(`✅ ${name}: ${type}`);
    } else {
      console.error(`❌ ${name}: ${type}`);
    }
  });
  
  // Step 2: Check DOM elements
  console.log("2️⃣ Checking DOM elements...");
  
  const elements = {
    'imageupload': document.getElementById("imageupload"),
    'buttonIconSolidoptions': document.getElementById("buttonIconSolidoptions"),
    'buttonIconOutlineoptions': document.getElementById("buttonIconOutlineoptions")
  };
  
  Object.entries(elements).forEach(([id, element]) => {
    if (element) {
      console.log(`✅ ${id}: found`);
    } else {
      console.error(`❌ ${id}: NOT found`);
    }
  });
  
  // Step 3: Check localStorage
  console.log("3️⃣ Checking localStorage...");
  
  const storage = {
    'sc_u_id': localStorage.getItem('sc_u_id'),
    'sc_auth_token': localStorage.getItem('sc_auth_token'),
    'sc_w_id': localStorage.getItem('sc_w_id')
  };
  
  Object.entries(storage).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}: ${value.substring(0, 10)}...`);
    } else {
      console.error(`❌ ${key}: missing`);
    }
  });
  
  // Step 4: Check pageId
  console.log("4️⃣ Checking pageId...");
  
  const pageId = document.querySelector("article[data-page-sections]")?.getAttribute("data-page-sections");
  if (pageId) {
    console.log(`✅ pageId: ${pageId}`);
  } else {
    console.error(`❌ pageId: NOT found`);
  }
  
  // Step 5: Check if icon functions are initialized
  console.log("5️⃣ Checking icon function initialization...");
  
  // Check if initImageUploadPreview is working
  const uploadButton = document.getElementById("imageupload");
  if (uploadButton) {
    console.log("✅ Upload button found, checking event listeners...");
    
    // Check if the button has the dataset listener
    if (uploadButton.dataset.listener === "true") {
      console.log("✅ Upload button has listener attached");
    } else {
      console.warn("⚠️ Upload button listener not attached");
    }
  }
  
  // Step 6: Test addPendingModification directly
  console.log("6️⃣ Testing addPendingModification directly...");
  
  if (typeof window.addPendingModification === 'function') {
    const testBlockId = "debug-test-" + Date.now();
    const testPayload = {
      icon: {
        selector: ".sqs-button-element--primary .sqscraft-button-icon",
        styles: { width: "20px", height: "auto" },
        iconData: { type: "test", src: "test.svg" }
      },
      buttonType: "primary",
      applyToAllTypes: false
    };
    
    try {
      window.addPendingModification(testBlockId, testPayload, "buttonIcon");
      console.log("✅ addPendingModification called successfully");
      
      // Check if it was added to pendingModifications
      if (window.pendingModifications && window.pendingModifications.has(testBlockId)) {
        const modifications = window.pendingModifications.get(testBlockId);
        console.log(`✅ Test modification added to pendingModifications: ${modifications.length} items`);
        
        const lastMod = modifications[modifications.length - 1];
        console.log("📋 Last modification:", lastMod);
      } else {
        console.error("❌ Test modification NOT found in pendingModifications");
      }
    } catch (error) {
      console.error("❌ Error calling addPendingModification:", error);
    }
  }
  
  // Step 7: Test saveButtonIconModifications directly
  console.log("7️⃣ Testing saveButtonIconModifications directly...");
  
  if (typeof window.saveButtonIconModifications === 'function') {
    const testBlockId = "debug-save-test-" + Date.now();
    const testPayload = {
      icon: {
        selector: ".sqs-button-element--primary .sqscraft-button-icon",
        styles: { width: "20px", height: "auto" },
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
    
    window.saveButtonIconModifications(testBlockId, testPayload)
      .then(result => {
        console.log("✅ saveButtonIconModifications result:", result);
      })
      .catch(error => {
        console.error("❌ saveButtonIconModifications error:", error);
      });
  }
  
  // Step 8: Check current pendingModifications
  console.log("8️⃣ Checking current pendingModifications...");
  
  if (window.pendingModifications) {
    console.log(`📊 Total pendingModifications: ${window.pendingModifications.size}`);
    
    if (window.pendingModifications.size > 0) {
      window.pendingModifications.forEach((modifications, blockId) => {
        console.log(`📋 Block ${blockId}: ${modifications.length} modifications`);
        modifications.forEach((mod, index) => {
          console.log(`  ${index + 1}. tagType: ${mod.tagType}, data:`, mod.css);
        });
      });
    } else {
      console.log("📊 No pending modifications found");
    }
  } else {
    console.error("❌ pendingModifications not available");
  }
  
  console.log("🏁 Icon Workflow Debug Complete");
}

// Function to monitor icon upload events
function monitorIconUpload() {
  console.log("👀 Monitoring icon upload events...");
  
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton) {
    console.error("❌ Upload button not found for monitoring");
    return;
  }
  
  // Monitor click events
  const originalClick = uploadButton.onclick;
  uploadButton.addEventListener('click', (e) => {
    console.log("🖱️ Upload button clicked!");
    console.log("Event:", e);
    if (originalClick) originalClick.call(uploadButton, e);
  });
  
  // Monitor file input creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    if (tagName.toLowerCase() === 'input') {
      console.log("📁 File input created:", element);
      
      // Monitor file input change events
      const originalAddEventListener = element.addEventListener;
      element.addEventListener = function(type, listener, options) {
        if (type === 'change') {
          console.log("📁 File input change listener added");
          const wrappedListener = function(event) {
            console.log("📁 File input change event triggered!");
            console.log("Files:", event.target.files);
            return listener.call(this, event);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    }
    return element;
  };
  
  console.log("✅ Icon upload monitoring active");
}

// Function to test actual icon upload simulation
function testIconUploadSimulation() {
  console.log("🧪 Testing icon upload simulation...");
  
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton) {
    console.error("❌ Upload button not found");
    return;
  }
  
  // Create a test file
  const testFile = new File(
    ['<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2L13.09 6.26L19.09 7.26L15 12.26L16.18 18.26L10 15.76L3.82 18.26L4 12.26L1 7.26L7.09 6.26L10 2Z" fill="#000"/></svg>'],
    'test-icon.svg',
    { type: 'image/svg+xml' }
  );
  
  console.log("📁 Test file created:", testFile);
  
  // Simulate the entire upload process
  try {
    // Step 1: Click the upload button
    console.log("1️⃣ Clicking upload button...");
    uploadButton.click();
    
    // Step 2: Wait a bit and then simulate file selection
    setTimeout(() => {
      console.log("2️⃣ Simulating file selection...");
      
      // Find the file input that was created
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const hiddenFileInput = Array.from(fileInputs).find(input => 
        input.style.display === 'none' && input.accept === 'image/*'
      );
      
      if (hiddenFileInput) {
        console.log("✅ Found hidden file input:", hiddenFileInput);
        
        // Simulate file selection
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        hiddenFileInput.files = dataTransfer.files;
        
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        hiddenFileInput.dispatchEvent(changeEvent);
        
        console.log("✅ File selection simulated");
      } else {
        console.error("❌ Hidden file input not found");
      }
    }, 1000);
    
  } catch (error) {
    console.error("❌ Error in upload simulation:", error);
  }
}

// Run the debug
console.log("🚀 Starting Icon Workflow Debug...");
debugIconWorkflow();

// Uncomment to monitor upload events
// monitorIconUpload();

// Uncomment to test upload simulation
// testIconUploadSimulation(); 