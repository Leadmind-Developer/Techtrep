import type { Metadata } from "next";

const siteUrl = "https://business.thetechtrep.com";
const siteName = "Techtrep Business Solutions";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,

    alternates: {
      canonical: path,
    },

    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_NG",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}