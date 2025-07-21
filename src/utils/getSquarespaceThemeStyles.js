export async function getSquarespaceThemeStyles() {
  const paletteVars = [
    '--accent-hsl',
    '--black-hsl',
    '--white-hsl',
    '--darkAccent-hsl',
    '--lightAccent-hsl'
  ];

  function getColorFromVariable(varName) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value ? `hsl(${value})` : null;
  }

  function getThemeColors() {
    const themeColors = {};
    paletteVars.forEach(varName => {
      const color = getColorFromVariable(varName);
      if (color) {
        themeColors[varName] = color;
      }
    });
    return themeColors;
  }

  return getThemeColors(); 
}
