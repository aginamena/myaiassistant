import NextAuthSession from "@/components/NextAuthSession";
import ThemeRegistry from "@/components/ThemeRegistry";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Let AI Handle Your WhatsApp Group Posting",
  description:
    "Stop wasting time manually posting to your WhatsApp groups every day. Let AI do the work, so you can focus on what really matters — growing your business.",
  openGraph: {
    type: "website",
    url: "https://myaiassistant-three.vercel.app",
    title: "Let AI Handle Your WhatsApp Group Posting",
    description:
      "Stop wasting time manually posting to your WhatsApp groups every day. Let AI do the work, so you can focus on what really matters — growing your business.",
    siteName: "Let AI Handle Your WhatsApp Group Posting",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
 window._mfq = window._mfq || [];
  (function() {
    var mf = document.createElement("script");
    mf.type = "text/javascript"; mf.defer = true;
    mf.src = "//cdn.mouseflow.com/projects/647136f3-4340-4541-a9a7-ad0662806f06.js";
    document.getElementsByTagName("head")[0].appendChild(mf);
  })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <NextAuthSession session={session}>
          <ThemeRegistry>{children}</ThemeRegistry>
        </NextAuthSession>
      </body>
    </html>
  );
}
