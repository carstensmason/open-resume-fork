"use client";
import { useState, useRef } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const TextStylingInfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <button
        type="button"
        aria-label="Text styling help"
        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-sky-600 focus:outline-none"
      >
        <InformationCircleIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-700 shadow-2xl">
          <div className="mb-2.5 flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="font-semibold text-gray-900">
              Text Styling Guide
            </span>
            <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
              New
            </span>
          </div>

          <p className="mb-3 text-[11px] text-gray-500">
            Format descriptions, additional info, and objectives using shortcuts or
            markdown:
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
              <span className="font-bold text-gray-800">Bold</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                  **text**
                </code>
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-500 shadow-2xs">
                  ⌘B / Ctrl+B
                </kbd>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
              <span className="italic text-gray-800">Italic</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                  *text*
                </code>
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-500 shadow-2xs">
                  ⌘I / Ctrl+I
                </kbd>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
              <span className="underline text-gray-800">Underline</span>
              <div className="flex items-center gap-2">
                <code className="rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                  __text__
                </code>
                <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-gray-500 shadow-2xs">
                  ⌘U / Ctrl+U
                </kbd>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
              <span className="font-bold italic text-gray-800">
                Bold + Italic
              </span>
              <code className="rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                ***text***
              </code>
            </div>

            <div className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1.5">
              <span className="line-through text-gray-800">Strikethrough</span>
              <code className="rounded bg-gray-200/80 px-1.5 py-0.5 font-mono text-[11px] text-gray-700">
                ~~text~~
              </code>
            </div>
          </div>

          <div className="mt-3 border-t border-gray-100 pt-2 text-[11px] text-gray-400">
            Tip: You can also highlight text and click the <strong>B</strong>,{" "}
            <em>I</em>, or <u>U</u> buttons above each field.
          </div>
        </div>
      )}
    </div>
  );
};
