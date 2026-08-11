import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "LaunchPad AI | AI-Powered Employee Onboarding & Knowledge Intelligence Platform",
  description: "LaunchPad AI is an AI-Powered Employee Onboarding & Knowledge Intelligence Platform transforming team documentation, automated onboarding workflows, and organizational knowledge into real-time intelligence.",
  keywords: ["LaunchPad AI", "AI Onboarding", "Knowledge Intelligence", "Employee Onboarding", "AI Knowledge Base", "RAG Copilot"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Inline script: apply saved theme class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('launchpad_theme_mode');
                  var isDark =
                    mode === 'dark' ? true :
                    mode === 'light' ? false :
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
