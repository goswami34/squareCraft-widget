// Example usage of the new Typography Font Family System
// This file shows how to properly integrate all components

import { handleAllFontFamilyClick, initTypographyFontFamilyEvents, handleFontFamilySelection } from './handleAllFontFamily.js';
import { initTypographyFontFamilyControls } from './initTypographyFontFamilyControls.js';

// Example context object that should be passed to the functions
const exampleContext = {
  lastClickedElement: null, // This should be set to the currently selected block element
  selectedSingleTextType: null, // This should be set to the selected text type (paragraph1, heading1, etc.)
  addPendingModification: (blockId, modifications) => {
    // This function should handle saving modifications to your storage system
    console.log('Adding pending modification:', { blockId, modifications });
    // Example implementation:
    // - Save to localStorage
    // - Send to server
    // - Update UI state
  }
};

// Function to initialize the typography font family system
export function initializeTypographyFontFamilySystem(context) {
  // Initialize event listeners for the font family dropdown
  initTypographyFontFamilyEvents(context);
  
  // Initialize the font family controls (this will be called when dropdown is opened)
  // The actual initialization happens in handleAllFontFamilyClick when the dropdown is opened
  
  console.log('Typography font family system initialized');
}

// Function to set the selected element (should be called when user selects a block)
export function setSelectedElement(element) {
  exampleContext.lastClickedElement = element;
  console.log('Selected element set:', element);
}

// Function to set the selected text type (should be called when user selects a text type)
export function setSelectedTextType(textType) {
  exampleContext.selectedSingleTextType = textType;
  console.log('Selected text type set:', textType);
}

// Function to handle text type selection (example implementation)
export function handleTextTypeSelection(textType) {
  setSelectedTextType(textType);
  
  // Update UI to show selected text type
  const textTypeButtons = document.querySelectorAll('[data-text-type]');
  textTypeButtons.forEach(button => {
    button.classList.remove('sc-active');
    if (button.getAttribute('data-text-type') === textType) {
      button.classList.add('sc-active');
    }
  });
  
  // Update font name display to show current font for selected text type
  updateFontNameDisplay();
}

// Function to update the font name display based on current selection
function updateFontNameDisplay() {
  const { lastClickedElement, selectedSingleTextType } = exampleContext;
  
  if (!lastClickedElement || !selectedSingleTextType) {
    return;
  }
  
  const paragraphSelector = getTextTypeSelector(selectedSingleTextType);
  if (!paragraphSelector) return;
  
  const selectedElements = lastClickedElement.querySelectorAll(paragraphSelector);
  if (selectedElements.length > 0) {
    const currentFontFamily = window.getComputedStyle(selectedElements[0]).fontFamily;
    const fontNameLabel = document.getElementById("scTypographyFontName");
    
    if (fontNameLabel) {
      // Extract font name from font-family string (remove quotes and fallbacks)
      const fontName = currentFontFamily.split(',')[0].replace(/['"]/g, '');
      fontNameLabel.innerText = fontName;
      fontNameLabel.style.fontFamily = currentFontFamily;
    }
  }
}

// Helper function to get CSS selector based on text type
function getTextTypeSelector(selectedTextType) {
  switch (selectedTextType) {
    case "paragraph1":
      return "p.sqsrte-large";
    case "paragraph2":
      return "p:not(.sqsrte-large):not(.sqsrte-small)";
    case "paragraph3":
      return "p.sqsrte-small";
    case "heading1":
      return "h1";
    case "heading2":
      return "h2";
    case "heading3":
      return "h3";
    case "heading4":
      return "h4";
    default:
      return null;
  }
}

// Example of how to set up text type selection buttons
export function setupTextTypeButtons() {
  const textTypeButtons = document.querySelectorAll('[data-text-type]');
  
  textTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const textType = button.getAttribute('data-text-type');
      handleTextTypeSelection(textType);
    });
  });
}

// Example of how to set up block selection
export function setupBlockSelection() {
  // This should be integrated with your existing block selection system
  document.addEventListener('click', (event) => {
    const blockElement = event.target.closest('[id^="block-"]');
    if (blockElement) {
      setSelectedElement(blockElement);
      updateFontNameDisplay();
    }
  });
}

// Function to load the CSS styles
export function loadTypographyFontFamilyStyles() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './src/styles/typography-font-dropdown.css';
  document.head.appendChild(link);
}

// Main initialization function
export function initTypographyFontFamilySystem() {
  // Load CSS styles
  loadTypographyFontFamilyStyles();
  
  // Setup event listeners
  setupTextTypeButtons();
  setupBlockSelection();
  
  // Initialize the system
  initializeTypographyFontFamilySystem(exampleContext);
  
  console.log('Typography font family system fully initialized');
}

// Export the context for external use
export { exampleContext as typographyContext }; 