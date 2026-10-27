import { View, Image } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
  ResumePDFStyledText,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import {
  GITHUB_IMAGE_DATA_URL,
  LINKEDIN_IMAGE_DATA_URL,
  GITHUB_IMAGE_SRC,
  LINKEDIN_IMAGE_SRC,
} from "components/Resume/ResumePDF/common/brandIcons";
import {
  formatSocialUsername,
  formatSocialUrl,
} from "lib/format-social";

const SocialButton = ({
  type,
  value,
  isPDF,
}: {
  type: "github" | "linkedin";
  value: string;
  isPDF: boolean;
}) => {
  const username = formatSocialUsername(type, value);
  const url = formatSocialUrl(type, value);
  const isGithub = type === "github";
  const iconSize = "10pt";
  const bgColor = isGithub ? "#24292f" : "#0a66c2";

  return (
    <ResumePDFLink src={url} isPDF={isPDF}>
      <View
        style={{
          ...styles.flexRow,
          alignItems: "center",
          gap: spacing["1"],
          backgroundColor: bgColor,
          borderRadius: "3pt",
          paddingTop: "2pt",
          paddingBottom: "2pt",
          paddingLeft: "5pt",
          paddingRight: "5pt",
        }}
      >
        {isPDF ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image
            src={isGithub ? GITHUB_IMAGE_DATA_URL : LINKEDIN_IMAGE_DATA_URL}
            style={{ width: iconSize, height: iconSize }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={isGithub ? GITHUB_IMAGE_DATA_URL : LINKEDIN_IMAGE_DATA_URL}
            alt={isGithub ? "GitHub" : "LinkedIn"}
            style={{
              width: iconSize,
              height: iconSize,
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        )}
        <ResumePDFText style={{ fontSize: "8.5pt", color: "#ffffff" }}>
          {username}
        </ResumePDFText>
      </View>
    </ResumePDFLink>
  );
};

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
}) => {
  const { name, email, phone, url, summary, location, github, linkedin } =
    profile;
  const iconProps = { email, phone, location, url };

  return (
    <ResumePDFSection style={{ marginTop: spacing["4"] }}>
      <View
        style={{
          ...styles.flexRowBetween,
          alignItems: "center",
        }}
      >
        <ResumePDFText
          bold={true}
          themeColor={themeColor}
          style={{ fontSize: "20pt" }}
        >
          {name}
        </ResumePDFText>
        {(github || linkedin) && (
          <View
            style={{
              ...styles.flexRow,
              alignItems: "center",
              gap: spacing["3"],
            }}
          >
            {github && (
              <SocialButton type="github" value={github} isPDF={isPDF} />
            )}
            {linkedin && (
              <SocialButton type="linkedin" value={linkedin} isPDF={isPDF} />
            )}
          </View>
        )}
      </View>
      {summary && (
        <ResumePDFText>
          <ResumePDFStyledText text={summary} />
        </ResumePDFText>
      )}
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`; // Keep only + and digits
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText>{value}</ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
