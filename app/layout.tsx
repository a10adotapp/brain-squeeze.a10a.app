import { LayoutProps } from "@/lib/props";
import "./globals.css";

export default async function Layout({
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
