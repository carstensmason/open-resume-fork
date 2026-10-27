export interface StyledTextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

/**
 * Parses markdown and HTML style tags into structured styled spans.
 * Supports:
 * - Bold: **text**, <b>text</b>, <strong>text</strong>
 * - Italic: *text*, _text_, <i>text</i>, <em>text</em>
 * - Bold+Italic: ***text***, ___text___, <b><i>text</i></b>
 * - Underline: <u>text</u>, __text__
 * - Strikethrough: ~~text~~, <s>text</s>, <del>text</del>
 */
export const parseStyledText = (
  text: string,
  parentStyle: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  } = {}
): StyledTextSpan[] => {
  if (!text) return [];

  // Regex matching formatting tokens in order of specificity
  const pattern =
    /(\*\*\*(.+?)\*\*\*|___(.+?)___|\*\*(.+?)\*\*|<b>(.+?)<\/b>|<strong>(.+?)<\/strong>|__(.+?)__|<u>(.+?)<\/u>|\*([^\*]+?)\*|_([^_]+?)_|<i>(.+?)<\/i>|<em>(.+?)<\/em>|~~(.+?)~~|<s>(.+?)<\/s>|<del>(.+?)<\/del>)/g;

  const result: StyledTextSpan[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({
        text: text.slice(lastIndex, match.index),
        ...parentStyle,
      });
    }

    const boldItalic = match[2] || match[3];
    const bold = match[4] || match[5] || match[6];
    const underline = match[7] || match[8];
    const italic = match[9] || match[10] || match[11] || match[12];
    const strike = match[13] || match[14] || match[15];

    let content = "";
    const currentStyle = { ...parentStyle };

    if (boldItalic) {
      content = boldItalic;
      currentStyle.bold = true;
      currentStyle.italic = true;
    } else if (bold) {
      content = bold;
      currentStyle.bold = true;
    } else if (underline) {
      content = underline;
      currentStyle.underline = true;
    } else if (italic) {
      content = italic;
      currentStyle.italic = true;
    } else if (strike) {
      content = strike;
      currentStyle.strikethrough = true;
    }

    // Recursively parse inner content to support nested styling (e.g. **bold and *italic***)
    const innerSpans = parseStyledText(content, currentStyle);
    if (innerSpans.length > 0) {
      result.push(...innerSpans);
    } else {
      result.push({ text: content, ...currentStyle });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), ...parentStyle });
  }

  return result;
};
