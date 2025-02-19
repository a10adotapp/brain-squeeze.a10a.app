import { LayoutProps } from "@/lib/props";
import "./globals.css";

export default function RootLayout({
  children,
}: LayoutProps) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
