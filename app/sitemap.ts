import { MetadataRoute } from "next"

const BASE_URL = "https://goodstanding.ai"

const articleSlugs = [
  "delaware-c-corp-formation",
  "irs-notice-startup",
  "california-foreign-qualification",
  "startup-compliance-checklist",
  "good-standing-explained",
  "international-founder-us-entity",
  "enrolled-agent-explainer",
  "delaware-franchise-tax-guide",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  return [
    // Core marketing pages
    { url: BASE_URL,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/demo`,                lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`,             lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/services`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/government-liaison`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/resources`,           lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/changelog`,           lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/international`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`,             lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE_URL}/faq`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Resource articles
    ...articleSlugs.map((slug) => ({
      url: `${BASE_URL}/resources/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    // Auth pages (lower priority)
    { url: `${BASE_URL}/signup`,              lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE_URL}/login`,               lastModified: now, changeFrequency: "yearly",  priority: 0.4 },

    // Legal pages
    { url: `${BASE_URL}/terms`,               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/privacy`,             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ]
}
