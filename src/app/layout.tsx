import "globals.css";
import { TopNavBar } from "components/TopNavBar";

export const metadata = {
  title: "OpenResume - Resume Builder",
  description: "Modern professional resume builder and parser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNavBar />
        {children}
      </body>
    </html>
  );
}
