import {
  formatSocialUsername,
  formatSocialUrl,
} from "lib/format-social";

describe("social link utilities", () => {
  describe("formatSocialUsername", () => {
    it("handles plain usernames", () => {
      expect(formatSocialUsername("github", "carstensmason")).toBe("carstensmason");
      expect(formatSocialUsername("linkedin", "masoncarstens")).toBe("masoncarstens");
    });

    it("strips full URLs to extract username", () => {
      expect(
        formatSocialUsername("github", "https://github.com/carstensmason")
      ).toBe("carstensmason");
      expect(
        formatSocialUsername("github", "https://www.github.com/carstensmason/")
      ).toBe("carstensmason");
      expect(
        formatSocialUsername("linkedin", "https://www.linkedin.com/in/masoncarstens/")
      ).toBe("masoncarstens");
      expect(
        formatSocialUsername("linkedin", "linkedin.com/in/masoncarstens")
      ).toBe("masoncarstens");
    });
  });

  describe("formatSocialUrl", () => {
    it("generates full URL from username", () => {
      expect(formatSocialUrl("github", "carstensmason")).toBe(
        "https://github.com/carstensmason"
      );
      expect(formatSocialUrl("github", "@carstensmason")).toBe(
        "https://github.com/carstensmason"
      );
      expect(formatSocialUrl("linkedin", "masoncarstens")).toBe(
        "https://linkedin.com/in/masoncarstens"
      );
    });

    it("preserves explicit full URLs", () => {
      expect(formatSocialUrl("github", "https://github.com/carstensmason")).toBe(
        "https://github.com/carstensmason"
      );
      expect(
        formatSocialUrl("linkedin", "https://www.linkedin.com/in/masoncarstens")
      ).toBe("https://www.linkedin.com/in/masoncarstens");
    });
  });
});
