import { parseStyledText } from "lib/parse-styled-text";

describe("parseStyledText", () => {
  it("returns plain text unchanged", () => {
    expect(parseStyledText("Hello world")).toEqual([{ text: "Hello world" }]);
  });

  it("parses bold text with markdown and HTML", () => {
    expect(parseStyledText("This is **bold** text")).toEqual([
      { text: "This is " },
      { text: "bold", bold: true },
      { text: " text" },
    ]);

    expect(parseStyledText("<b>HTML bold</b>")).toEqual([
      { text: "HTML bold", bold: true },
    ]);
  });

  it("parses italic text with markdown and HTML", () => {
    expect(parseStyledText("This is *italic* and _italic_")).toEqual([
      { text: "This is " },
      { text: "italic", italic: true },
      { text: " and " },
      { text: "italic", italic: true },
    ]);

    expect(parseStyledText("<i>HTML italic</i>")).toEqual([
      { text: "HTML italic", italic: true },
    ]);
  });

  it("parses underline with markdown and HTML", () => {
    expect(parseStyledText("<u>underlined</u> and __underlined__")).toEqual([
      { text: "underlined", underline: true },
      { text: " and " },
      { text: "underlined", underline: true },
    ]);
  });

  it("parses nested styles like bold-italic", () => {
    expect(
      parseStyledText("Here is **bold and *italic* inside** text")
    ).toEqual([
      { text: "Here is " },
      { text: "bold and ", bold: true },
      { text: "italic", bold: true, italic: true },
      { text: " inside", bold: true },
      { text: " text" },
    ]);
  });

  it("handles empty or falsy text", () => {
    expect(parseStyledText("")).toEqual([]);
  });
});
