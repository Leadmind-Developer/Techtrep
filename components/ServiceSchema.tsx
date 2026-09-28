type ServiceSchemaProps = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
};

const siteUrl = "https://business.thetechtrep.com";

export default function ServiceSchema({
  name,
  description,
  path,
  serviceType,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: `${siteUrl}${path}`,

    provider: {
      "@type": "Organization",
      name: "Techtrep Business Solutions",
      url: siteUrl,
      telephone: "+2348179458159",
      email: "email@thetechtrep.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "43 Idowu Ogunnowo",
        addressLocality: "Ojodu",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
    },

    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}