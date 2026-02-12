/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://demarche-facile-60.vercel.app/", 
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
};
