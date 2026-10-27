import { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useAutosizeTextareaHeight } from "lib/hooks/useAutosizeTextareaHeight";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  // name is passed in as a const string. Therefore, we make it a generic type so its type can
  // be more restricted as a const for the first argument in onChange
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

/**
 * Text formatting toolbar for bold, italic, and underline styling
 */
export const TextFormattingToolbar = ({
  onBold,
  onItalic,
  onUnderline,
}: {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
}) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onBold}
      title="Bold (Cmd+B / Ctrl+B or **text**)"
      aria-label="Bold"
      className="flex h-5 w-5 items-center justify-center rounded border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
    >
      B
    </button>
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onItalic}
      title="Italic (Cmd+I / Ctrl+I or *text*)"
      aria-label="Italic"
      className="flex h-5 w-5 items-center justify-center rounded border border-gray-200 bg-white text-xs font-semibold italic text-gray-700 shadow-xs hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
    >
      I
    </button>
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onUnderline}
      title="Underline (Cmd+U / Ctrl+U or <u>text</u>)"
      aria-label="Underline"
      className="flex h-5 w-5 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium underline text-gray-700 shadow-xs hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200"
    >
      U
    </button>
  </div>
);

/**
 * InputGroupWrapper wraps a label or header with optional toolbar around input children.
 */
export const InputGroupWrapper = ({
  label,
  className,
  toolbar,
  children,
}: {
  label: string;
  className?: string;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className={`text-base font-medium text-gray-700 ${className}`}>
    <div className="flex items-center justify-between gap-2">
      <label>{label}</label>
      {toolbar}
    </div>
    {children}
  </div>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={INPUT_CLASS_NAME}
      />
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
  hasToolbar = true,
}: InputProps<T, string> & { hasToolbar?: boolean }) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  const applyFormat = (
    prefix: string,
    suffix: string = prefix,
    defaultPlaceholder: string = "text"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let replacement = "";
    if (selectedText) {
      if (
        selectedText.startsWith(prefix) &&
        selectedText.endsWith(suffix) &&
        selectedText.length >= prefix.length + suffix.length
      ) {
        replacement = selectedText.slice(
          prefix.length,
          selectedText.length - suffix.length
        );
      } else {
        const leadingSpaces = selectedText.match(/^\s*/)?.[0] || "";
        const trailingSpaces = selectedText.match(/\s*$/)?.[0] || "";
        const coreText = selectedText.slice(
          leadingSpaces.length,
          selectedText.length - trailingSpaces.length
        );
        replacement = `${leadingSpaces}${prefix}${coreText || defaultPlaceholder}${suffix}${trailingSpaces}`;
      }
    } else {
      replacement = `${prefix}${defaultPlaceholder}${suffix}`;
    }

    textarea.setRangeText(replacement, start, end, "select");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    onChange(name, textarea.value.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " "));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.metaKey || e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        applyFormat("**", "**", "bold");
      } else if (key === "i") {
        e.preventDefault();
        applyFormat("*", "*", "italic");
      } else if (key === "u") {
        e.preventDefault();
        applyFormat("<u>", "</u>", "underline");
      }
    }
  };

  const toolbar = hasToolbar ? (
    <TextFormattingToolbar
      onBold={() => applyFormat("**", "**", "bold")}
      onItalic={() => applyFormat("*", "*", "italic")}
      onUnderline={() => applyFormat("<u>", "</u>", "underline")}
    />
  ) : undefined;

  return (
    <InputGroupWrapper
      label={label}
      className={wrapperClassName}
      toolbar={toolbar}
    >
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>(
  props: InputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome"); // Note that Chrome also includes Safari in its userAgent
    if (isFirefox || isSafari) {
      setShowFallback(true);
    }
  }, []);

  if (showFallback) {
    return <BulletListTextareaFallback {...props} />;
  }
  return <BulletListTextareaGeneral {...props} />;
};

/**
 * BulletListTextareaGeneral is a textarea where each new line starts with a bullet point.
 * Supports bold (**text**), italic (*text*), and underline (<u>text</u>) with a toolbar and shortcuts.
 */
const BulletListTextareaGeneral = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  const applyFormat = (
    prefix: string,
    suffix: string = prefix,
    defaultPlaceholder: string = "text"
  ) => {
    const selection = window.getSelection();
    const container = contentEditableRef.current;
    if (!selection || !container) return;

    if (!container.contains(selection.anchorNode)) {
      container.focus();
    }

    const selectedText = selection.toString();
    let replacement = "";

    if (selectedText) {
      if (
        selectedText.startsWith(prefix) &&
        selectedText.endsWith(suffix) &&
        selectedText.length >= prefix.length + suffix.length
      ) {
        replacement = selectedText.slice(
          prefix.length,
          selectedText.length - suffix.length
        );
      } else {
        const leadingSpaces = selectedText.match(/^\s*/)?.[0] || "";
        const trailingSpaces = selectedText.match(/\s*$/)?.[0] || "";
        const coreText = selectedText.slice(
          leadingSpaces.length,
          selectedText.length - trailingSpaces.length
        );
        replacement = `${leadingSpaces}${prefix}${coreText || defaultPlaceholder}${suffix}${trailingSpaces}`;
      }
    } else {
      replacement = `${prefix}${defaultPlaceholder}${suffix}`;
    }

    document.execCommand("insertText", false, replacement);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        applyFormat("**", "**", "bold");
      } else if (key === "i") {
        e.preventDefault();
        applyFormat("*", "*", "italic");
      } else if (key === "u") {
        e.preventDefault();
        applyFormat("<u>", "</u>", "underline");
      }
    }
  };

  const html = getHTMLFromBulletListStrings(bulletListStrings);

  const toolbar = (
    <TextFormattingToolbar
      onBold={() => applyFormat("**", "**", "bold")}
      onItalic={() => applyFormat("*", "*", "italic")}
      onUnderline={() => applyFormat("<u>", "</u>", "underline")}
    />
  );

  return (
    <InputGroupWrapper
      label={label}
      className={wrapperClassName}
      toolbar={toolbar}
    >
      <ContentEditable
        innerRef={contentEditableRef as any}
        contentEditable={true}
        className={`${INPUT_CLASS_NAME} cursor-text [&>div]:list-item ${
          showBulletPoints ? "pl-7" : "[&>div]:list-['']"
        }`}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          if (e.type === "input") {
            const { innerText } = e.currentTarget as HTMLDivElement;
            const newBulletListStrings =
              getBulletListStringsFromInnerText(innerText);
            onChange(name, newBulletListStrings);
          }
        }}
        html={html}
      />
    </InputGroupWrapper>
  );
};

const NORMALIZED_LINE_BREAK = "\n";
/**
 * Normalize line breaks to be \n since different OS uses different line break
 *    Windows -> \r\n (CRLF)
 *    Unix    -> \n (LF)
 *    Mac     -> \n (LF), or \r (CR) for earlier versions
 */
const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);
const dedupeLineBreak = (str: string) =>
  str.replace(/\n\n/g, NORMALIZED_LINE_BREAK);
const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const getBulletListStringsFromInnerText = (innerText: string) => {
  const cleanInnerText = innerText.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ");
  const innerTextWithNormalizedLineBreak = normalizeLineBreak(cleanInnerText);

  // In Windows Chrome, pressing enter creates 2 line breaks "\n\n"
  // This dedupes it into 1 line break "\n"
  let newInnerText = dedupeLineBreak(innerTextWithNormalizedLineBreak);

  // Handle the special case when content is empty
  if (newInnerText === NORMALIZED_LINE_BREAK) {
    newInnerText = "";
  }

  return getStringsByLineBreak(newInnerText);
};

const getHTMLFromBulletListStrings = (bulletListStrings: string[]) => {
  // If bulletListStrings is an empty array, make it an empty div
  if (bulletListStrings.length === 0) {
    return "<div></div>";
  }

  return bulletListStrings.map((text) => `<div>${text}</div>`).join("");
};

/**
 * BulletListTextareaFallback is a fallback for BulletListTextareaGeneral to work around
 * content editable div issue in some browsers. For example, in Firefox, if user enters
 * space in the content editable div at the end of line, Firefox returns it as a new
 * line character \n instead of space in innerText.
 */
const BulletListTextareaFallback = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(
    bulletListStrings,
    showBulletPoints
  );

  return (
    <Textarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={(name, value) => {
        onChange(
          name,
          getBulletListStringsFromTextareaValue(value, showBulletPoints)
        );
      }}
    />
  );
};

const getTextareaValueFromBulletListStrings = (
  bulletListStrings: string[],
  showBulletPoints: boolean
) => {
  const prefix = showBulletPoints ? "• " : "";

  if (bulletListStrings.length === 0) {
    return prefix;
  }

  let value = "";
  for (let i = 0; i < bulletListStrings.length; i++) {
    const string = bulletListStrings[i];
    const isLastItem = i === bulletListStrings.length - 1;
    value += `${prefix}${string}${isLastItem ? "" : "\r\n"}`;
  }
  return value;
};

const getBulletListStringsFromTextareaValue = (
  textareaValue: string,
  showBulletPoints: boolean
) => {
  const cleanTextareaValue = textareaValue.replace(/[\u00A0\u200B\u200C\u200D\uFEFF]/g, " ");
  const textareaValueWithNormalizedLineBreak =
    normalizeLineBreak(cleanTextareaValue);

  const strings = getStringsByLineBreak(textareaValueWithNormalizedLineBreak);

  if (showBulletPoints) {
    // Filter out empty strings
    const nonEmptyStrings = strings.filter((s) => s !== "•");

    let newStrings: string[] = [];
    for (let string of nonEmptyStrings) {
      if (string.startsWith("• ")) {
        newStrings.push(string.slice(2));
      } else if (string.startsWith("•")) {
        // Handle the special case when user wants to delete the bullet point, in which case
        // we combine it with the previous line if previous line exists
        const lastItemIdx = newStrings.length - 1;
        if (lastItemIdx >= 0) {
          const lastItem = newStrings[lastItemIdx];
          newStrings[lastItemIdx] = `${lastItem}${string.slice(1)}`;
        } else {
          newStrings.push(string.slice(1));
        }
      } else {
        newStrings.push(string);
      }
    }
    return newStrings;
  }

  return strings;
};
