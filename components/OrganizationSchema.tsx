export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Techtrep Business Solutions",
    url: "https://business.thetechtrep.com",
    email: "email@thetechtrep.com",
    telephone: "+2348179458159",
    description:
      "Technology, automation, AI, software, networking and infrastructure solutions for growing businesses.",

    address: {
      "@type": "PostalAddress",
      streetAddress: "43 Idowu Ogunnowo",
      addressLocality: "Ojodu",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },

    parentOrganization: {
      "@type": "Organization",
      name: "Techtrep",
      url: "https://thetechtrep.com",
    },

    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },

    knowsAbout: [
      "Business automation",
      "Artificial intelligence",
      "Digital transformation",
      "Custom software",
      "Business analytics",
      "Networking",
      "IT infrastructure",
      "Cloud technology",
      "Systems integration",
    ],

    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+2348179458159",
      email: "email@thetechtrep.com",
      contactType: "customer service",
      availableLanguage: ["English"],
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