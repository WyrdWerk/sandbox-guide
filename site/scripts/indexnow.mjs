// Tells Bing, Yandex and other IndexNow engines that the site changed, so they recrawl
// within hours instead of days. Run after a deploy is live: npm run indexnow
// Google does not use IndexNow; it reads the sitemap from Search Console.
const site = "https://botperch.com";
const key = "d9902dbb5f8617a9cbd6ae3811e8d068"; // public by design: the same value is served at /<key>.txt

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (!res.ok && res.status !== 202) process.exit(1);
