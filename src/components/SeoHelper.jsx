import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelper = ({
  title,
  description,
  keywords,
  canonicalUrl = window.location.href,
  ogTitle,
  ogDescription,
  ogImage = "https://paridhan-rental.web.app/og-image.jpg",
  schemaMarkup = null
}) => {
  const fullTitle = `${title} | Paridhan Luxury Fashion Rental`;
  const finalOgTitle = ogTitle || title;
  const finalOgDesc = ogDescription || description;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Schema Markup Injection */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHelper;
