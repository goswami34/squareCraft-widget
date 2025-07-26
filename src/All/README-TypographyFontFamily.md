# Typography Font Family System

This document explains the new typography font family system that follows the same pattern as the button font family controls.

## Overview

The new typography font family system provides:
- Google Fonts API integration
- Infinite scroll dropdown with lazy loading
- Font weight options based on available font variants
- Proper style application to different text types (headings, paragraphs)
- Consistent UI/UX with the button font family system

## Files Structure

```
src/All/
├── initTypographyFontFamilyControls.js    # Main font family controls
├── handleAllFontFamily.js                 # Updated event handlers
├── typographyFontFamilyExample.js         # Usage example
└── README-TypographyFontFamily.md         # This file

src/components/Typo/
└── typoAllSelect.js                       # Updated HTML structure

src/styles/
└── typography-font-dropdown.css           # Dropdown styling
```

## Key Features

### 1. Google Fonts Integration
- Fetches fonts from Google Fonts API
- Loads fonts dynamically as needed
- Supports all Google Fonts variants

### 2. Infinite Scroll Dropdown
- Loads 20 fonts at a time
- Smooth scrolling experience
- Loading indicator while fetching fonts

### 3. Font Weight Support
- Automatically shows available font weights for selected font
- Updates font weight dropdown based on font selection
- Applies font weight changes immediately

### 4. Text Type Support
- Supports all text types: paragraph1, paragraph2, paragraph3, heading1, heading2, heading3, heading4
- Applies styles to correct CSS selectors
- Maintains separate styles for each text type

## Usage

### 1. Basic Integration

```javascript
import { initTypographyFontFamilySystem } from './src/All/typographyFontFamilyExample.js';

// Initialize the system
initTypographyFontFamilySystem();
```

### 2. Manual Integration

```javascript
import { initTypographyFontFamilyControls } from './src/All/initTypographyFontFamilyControls.js';
import { initTypographyFontFamilyEvents } from './src/All/handleAllFontFamily.js';

// Set up your context
const context = {
  lastClickedElement: selectedBlock,
  selectedSingleTextType: 'heading1',
  addPendingModification: (blockId, modifications) => {
    // Handle modifications
  }
};

// Initialize controls
initTypographyFontFamilyControls(
  () => context.lastClickedElement,
  context.addPendingModification,
  showNotification,
  saveTypographyModifications
);

// Initialize events
initTypographyFontFamilyEvents(context);
```

### 3. HTML Structure

The HTML structure has been updated in `typoAllSelect.js`:

```html
<div id="scFontSelect" class="sc-flex sc-bg-494949 sc-h-9 sc-col-span-8 sc-rounded-6px sc-justify-between sc-border sc-border-solid sc-border-585858 sc-items-center sc-relative">
  
  <div id="scTypographyFontName" class="sc-text-sm sc-poppins sc-font-light sc-px-2 sc-text-white sc-cursor-pointer">
    Select Font
  </div>

  <div class="sc-bg-3f3f3f sc-px-2 sc-cursor-pointer" style="height: 27px; padding: 0 3px;">
    <img class="sc-rotate-180 sc-mt-3" width="12px" src="arrow.svg" alt="">
  </div>

  <!-- Font Family Dropdown Options -->
  <div id="scTypographyFontFamilyOptions" class="sc-hidden sc-absolute sc-top-full sc-left-0 sc-right-0 sc-mt-1 sc-bg-3f3f3f sc-max-h-60 sc-overflow-y-auto sc-rounded-6px sc-border sc-border-585858 sc-z-50">
    <!-- Fonts will be populated here -->
  </div>

  <!-- Font Weight Dropdown Options -->
  <div id="scTypographyFontWeightOptions" class="sc-hidden sc-absolute sc-top-full sc-left-0 sc-right-0 sc-mt-1 sc-bg-3f3f3f sc-max-h-60 sc-overflow-y-auto sc-rounded-6px sc-border sc-border-585858 sc-z-50">
    <!-- Font weights will be populated here -->
  </div>
</div>
```

## API Reference

### initTypographyFontFamilyControls(getSelectedElement, addPendingModification, showNotification, saveTypographyModifications)

Initializes the font family controls with Google Fonts integration.

**Parameters:**
- `getSelectedElement`: Function that returns the currently selected element
- `addPendingModification`: Function to add modifications to pending changes
- `showNotification`: Function to show notifications
- `saveTypographyModifications`: Function to save typography modifications

### handleAllFontFamilyClick(event, context)

Handles the click event on the font family dropdown.

**Parameters:**
- `event`: Click event object
- `context`: Context object with lastClickedElement, selectedSingleTextType, and addPendingModification

### handleFontFamilySelection(fontFamily, context)

Handles the selection of a specific font family.

**Parameters:**
- `fontFamily`: The selected font family name
- `context`: Context object with lastClickedElement, selectedSingleTextType, and addPendingModification

## Differences from Old Implementation

### Old Implementation Issues:
1. Used static `<select>` element with limited font options
2. No Google Fonts integration
3. No font weight support
4. Basic styling without proper dropdown UI
5. Limited error handling

### New Implementation Benefits:
1. **Dynamic Font Loading**: Fetches fonts from Google Fonts API
2. **Infinite Scroll**: Loads fonts in batches for better performance
3. **Font Weight Support**: Shows available weights for each font
4. **Better UI/UX**: Proper dropdown with hover effects and animations
5. **Error Handling**: Proper error handling and loading states
6. **Consistent Design**: Matches the button font family system design
7. **Accessibility**: Proper focus states and keyboard navigation

## Styling

The system includes comprehensive CSS styling in `typography-font-dropdown.css`:

- Dropdown styling with proper shadows and borders
- Hover effects and transitions
- Custom scrollbar styling
- Loading animations
- Responsive design
- Accessibility features

## Error Handling

The system includes proper error handling:

- Network errors when fetching fonts
- Missing elements or invalid selectors
- Font loading failures
- User feedback through notifications

## Performance Considerations

- Fonts are loaded lazily (only when needed)
- Infinite scroll prevents loading all fonts at once
- Font files are cached by the browser
- Efficient DOM manipulation with proper cleanup

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support
- Fetch API support
- CSS custom properties support

## Migration Guide

To migrate from the old implementation:

1. Replace the `<select>` element with the new dropdown structure
2. Update event handlers to use the new functions
3. Include the new CSS file
4. Update your context object to include required properties
5. Test with different text types and fonts

## Troubleshooting

### Common Issues:

1. **Fonts not loading**: Check Google Fonts API key and network connection
2. **Dropdown not showing**: Ensure CSS is loaded and elements exist
3. **Styles not applying**: Check if block ID and text type are properly set
4. **Performance issues**: Verify infinite scroll is working correctly

### Debug Tips:

- Check browser console for errors
- Verify element IDs match between HTML and JavaScript
- Test with different text types
- Monitor network requests for font loading 