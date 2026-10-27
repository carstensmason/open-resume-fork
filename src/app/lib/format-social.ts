export const formatSocialUsername = (
  type: "github" | "linkedin",
  raw: string
) => {
  const trimmed = raw.trim();
  if (type === "github") {
    return trimmed
      .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
      .replace(/^github\.com\//i, "")
      .replace(/\/$/, "");
  }
  return trimmed
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
    .replace(/^https?:\/\/(www\.)?linkedin\.com\//i, "")
    .replace(/^linkedin\.com\/in\//i, "")
    .replace(/^linkedin\.com\//i, "")
    .replace(/\/$/, "");
};

export const formatSocialUrl = (type: "github" | "linkedin", raw: string) => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const username = formatSocialUsername(type, trimmed).replace(/^@/, "");
  if (type === "github") {
    return `https://github.com/${username}`;
  }
  return `https://linkedin.com/in/${username}`;
};
