import { LayoutProps } from "@/lib/props";
import { LiffContextProvider } from "./_contexts/liff-context";
import "./globals.css";

export default async function Layout({
  children,
}: LayoutProps) {
  return (
    <html>
      <body className="bg-gray-100">
        <LiffContextProvider>
          <div className="max-w-3xl mx-auto p-4">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              {children}
            </div>
          </div>
        </LiffContextProvider>
      </body>
    </html>
  );
}
