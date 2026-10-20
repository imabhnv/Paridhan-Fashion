import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoHelper = ({
  title,
  description,
  keywords = '',
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://tussuto-rental.web.app',
  ogTitle,
  ogDescription,
  ogImage = "https://tussuto-rental.web.app/og-image.jpg",
  ogType = "website",
  noindex = false,
  schema = null,
  schemaMarkup = null,
  breadcrumbs = null,
}) => {
  // If title already has Tussuto, don't duplicate
  const fullTitle = title.includes('Tussuto')
    ? title
    : `${title} | Tussuto Luxury Fashion Rental`;

  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDesc = ogDescription || description;

  // Ensure high-priority Tussuto brand keywords are embedded on every page
  const coreBrandKeywords = "Tussuto, Tussuto fashion, Tussuto rental, Tussuto luxury clothing, rent designer outfits Tussuto, luxury fashion rental India";
  const finalKeywords = keywords
    ? `${keywords}, ${coreBrandKeywords}`
    : coreBrandKeywords;

  // Build breadcrumbs schema if provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((bc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": bc.name,
      "item": bc.item || (bc.path?.startsWith('http') ? bc.path : `https://tussuto-rental.web.app${bc.path || ''}`)
    }))
  } : null;

  // Combine schemas into an array
  const allSchemas = [];
  if (breadcrumbSchema) allSchemas.push(breadcrumbSchema);
  const activeSchema = schemaMarkup || schema;
  if (activeSchema) {
    if (Array.isArray(activeSchema)) {
      allSchemas.push(...activeSchema);
    } else {
      allSchemas.push(activeSchema);
    }
  }

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content="Tussuto" />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Tussuto" />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tussuto" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Schema Markup Injection */}
      {allSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHelper;
