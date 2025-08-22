/**
 * Utility functions for handling Arabic text issues
 */

/**
 * Detects corrupted Arabic text containing replacement characters (�)
 */
export function hasCorruptedArabicText(text: string): boolean {
  return text.includes('\ufffd') || text.includes('�');
}

/**
 * Attempts to fix common Arabic text corruption issues
 */
export function fixCorruptedArabicText(text: string): string {
  // Common corruptions and their fixes
  const fixes: Array<[string, string]> = [
    ['ع��و', 'عضو'],
    ['أ��لا', 'أهلا'],
    ['��', 'ض'], // Common corruption for ض
    ['أهل��', 'أهلاً'],
    ['مرح��', 'مرحباً'],
    ['عائل��', 'عائلة'],
    // Add more common corruptions as needed
  ];

  let fixedText = text;
  
  for (const [corrupted, correct] of fixes) {
    fixedText = fixedText.replace(new RegExp(corrupted, 'g'), correct);
  }

  // Remove any remaining replacement characters
  fixedText = fixedText.replace(/\ufffd+/g, '');
  
  return fixedText;
}

/**
 * Scans for corrupted Arabic text in the DOM
 */
export function scanAndFixCorruptedText(): { found: boolean; fixed: number } {
  const textNodes: Text[] = [];
  let fixed = 0;
  
  // Get all text nodes in the document
  function getTextNodes(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        getTextNodes(node.childNodes[i]);
      }
    }
  }
  
  getTextNodes(document.body);
  
  // Fix corrupted text in each text node
  for (const textNode of textNodes) {
    if (textNode.textContent && hasCorruptedArabicText(textNode.textContent)) {
      const originalText = textNode.textContent;
      const fixedText = fixCorruptedArabicText(originalText);
      
      if (originalText !== fixedText) {
        textNode.textContent = fixedText;
        fixed++;
      }
    }
  }
  
  return {
    found: fixed > 0,
    fixed
  };
}
