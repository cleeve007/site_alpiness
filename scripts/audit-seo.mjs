import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const outputRoot = path.resolve(process.argv[2] ?? "_site");
const errors = [];
const indexablePages = [];
let noindexCount = 0;
let redirectCount = 0;

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    else if (entry.name.endsWith(".html")) files.push(absolutePath);
  }
  return files;
}

function value(source, pattern) {
  return source.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function pageLabel(file) {
  return `/${path.relative(outputRoot, file).replaceAll(path.sep, "/")}`;
}

function requireValue(page, label, candidate) {
  if (!candidate) errors.push(`${page} : ${label} manquant`);
}

let htmlFiles;
try {
  htmlFiles = await walk(outputRoot);
} catch {
  console.error(`Dossier généré introuvable : ${outputRoot}`);
  console.error("Usage : npm run seo:check -- <chemin-du-site-généré>");
  process.exit(1);
}

for (const file of htmlFiles) {
  const page = pageLabel(file);
  if (page.includes("/_preview_includes/") || page.startsWith("/partials/")) continue;

  const source = await fs.readFile(file, "utf8");
  const isRedirect = /<meta[^>]+http-equiv=["']refresh["']/i.test(source)
    || /<title>\s*(?:Redirecting|Redirection)/i.test(source);
  if (isRedirect) {
    redirectCount += 1;
    continue;
  }

  const title = value(source, /<title>([\s\S]*?)<\/title>/i);
  const description = value(source, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const robots = value(source, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const canonical = value(source, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const h1Count = (source.match(/<h1(?:\s[^>]*)?>/gi) ?? []).length;
  const favicon = /<link\s+rel=["']icon["'][^>]+href=["'][^"']*favicon\.ico["']/i.test(source);
  const pngIcon = /<link\s+rel=["']icon["'][^>]+sizes=["']96x96["']/i.test(source);
  const appleIcon = /<link\s+rel=["']apple-touch-icon["'][^>]+sizes=["']180x180["']/i.test(source);
  const noindex = robots.toLowerCase().includes("noindex");

  requireValue(page, "title", title);
  requireValue(page, "meta description", description);
  requireValue(page, "URL canonique", canonical);
  if (canonical && !canonical.startsWith("https://alpinessenoisans.com/")) {
    errors.push(`${page} : URL canonique inattendue (${canonical})`);
  }
  if (h1Count !== 1) errors.push(`${page} : ${h1Count} titre H1 trouvé(s), 1 attendu`);
  if (!favicon || !pngIcon || !appleIcon) errors.push(`${page} : déclarations de favicon incomplètes`);

  if (noindex) {
    noindexCount += 1;
    continue;
  }

  if (title.length < 20 || title.length > 65) {
    errors.push(`${page} : longueur du title hors cible (${title.length} caractères)`);
  }
  if (description.length < 70 || description.length > 170) {
    errors.push(`${page} : longueur de la meta description hors cible (${description.length} caractères)`);
  }

  const ogTitle = value(source, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  const ogDescription = value(source, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogUrl = value(source, /<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i);
  const ogImage = value(source, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  const twitterCard = value(source, /<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i);
  requireValue(page, "og:title", ogTitle);
  requireValue(page, "og:description", ogDescription);
  requireValue(page, "og:url", ogUrl);
  requireValue(page, "og:image", ogImage);
  requireValue(page, "twitter:card", twitterCard);
  const jsonLdBlocks = [...source.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (!jsonLdBlocks.length) {
    errors.push(`${page} : données structurées JSON-LD manquantes`);
  } else {
    for (const [, json] of jsonLdBlocks) {
      try {
        JSON.parse(json);
      } catch (error) {
        errors.push(`${page} : JSON-LD invalide (${error.message})`);
      }
    }
  }

  if (ogImage.startsWith("https://alpinessenoisans.com/")) {
    const imagePath = new URL(ogImage).pathname;
    try {
      await fs.access(path.join(outputRoot, ...imagePath.split("/").filter(Boolean)));
    } catch {
      errors.push(`${page} : image Open Graph introuvable (${imagePath})`);
    }
  }

  indexablePages.push({ page, title, description, canonical });
}

for (const key of ["title", "description", "canonical"]) {
  const seen = new Map();
  for (const page of indexablePages) {
    const candidate = page[key];
    if (!candidate) continue;
    if (seen.has(candidate)) {
      errors.push(`${page.page} : ${key} dupliqué avec ${seen.get(candidate)}`);
    } else {
      seen.set(candidate, page.page);
    }
  }
}

try {
  const robots = await fs.readFile(path.join(outputRoot, "robots.txt"), "utf8");
  if (!/^User-agent:\s*\*/mi.test(robots) || !/^Sitemap:\s*https:\/\/alpinessenoisans\.com\/sitemap\.xml/mi.test(robots)) {
    errors.push("/robots.txt : directives User-agent ou Sitemap manquantes");
  }
} catch {
  errors.push("/robots.txt : fichier manquant");
}

if (errors.length) {
  console.error(`Audit SEO en échec (${errors.length} anomalie${errors.length > 1 ? "s" : ""}) :`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Audit SEO réussi : ${indexablePages.length} pages indexables, ${noindexCount} pages noindex et ${redirectCount} redirections.`);
}
