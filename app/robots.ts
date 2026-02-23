import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/invite/", "/auth/"],
      },
    ],
    sitemap: "https://goodstanding.ai/sitemap.xml",
  }
}
