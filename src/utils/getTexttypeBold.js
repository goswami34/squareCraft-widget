
export function getTextTypeBold(tagName, element) {
    if (!tagName) return null;
    
    // Convert tab ID to text type
    if (tagName.startsWith('heading')) {
        return `h${tagName.replace('heading', '')}`;
    } else if (tagName.startsWith('paragraph')) {
        return 'p';
    }
    
    return null;
  }