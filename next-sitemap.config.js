/** @type {import('next-sitemap').IConfig} */
const demarches = require("./app/data/demarches.json");

module.exports = {
  siteUrl: "https://demarche-facile-60.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  additionalPaths: async (config) => {
    const staticPaths = ["/", "/demarches"];
    const demarchePaths = demarches.map((item) => `/demarches/${item.slug}`);
    const allPaths = [...staticPaths, ...demarchePaths];

    return Promise.all(
      allPaths.map((path) => config.transform(config, path))
    );
  },
};


