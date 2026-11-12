import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([
  ".git",
  ".jekyll-cache",
  "_site",
  "node_modules",
  "tmp",
  "work",
]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".yml", ".yaml"]);
const blockedExtensions = new Set([".eml", ".key", ".msg", ".p12", ".pem", ".pfx"]);
const allowedStatuses = new Set(["upcoming", "on-request", "past"]);
const errors = [];

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    else files.push(absolutePath);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function frontMatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*["']?([^\\r\\n"']+)["']?\\s*$`, "m"));
  return match?.[1]?.trim();
}

const files = await walk(root);

for (const requiredFile of ["favicon.ico", "apple-touch-icon.png", "assets/img/favicon-96.png"]) {
  try {
    await fs.access(path.join(root, ...requiredFile.split("/")));
  } catch {
    errors.push(`${requiredFile} : icône publique manquante`);
  }
}

for (const file of files) {
  const name = path.basename(file).toLowerCase();
  const extension = path.extname(name);
  if (blockedExtensions.has(extension) || name === ".env" || name.startsWith(".env.")) {
    errors.push(`${relative(file)} : fichier sensible interdit dans un dépôt public`);
  }
}

const assetPattern = /\/assets\/[A-Za-z0-9À-ÿ._~!$&+,;=:@%\/-]+/g;
for (const file of files.filter((candidate) => textExtensions.has(path.extname(candidate).toLowerCase()))) {
  const source = await fs.readFile(file, "utf8");
  for (const reference of source.match(assetPattern) ?? []) {
    const cleanReference = reference.replace(/[.,;:]+$/, "");
    const target = path.join(root, ...cleanReference.split("/").filter(Boolean));
    try {
      await fs.access(target);
    } catch {
      errors.push(`${relative(file)} : fichier référencé introuvable ${cleanReference}`);
    }
  }
}

const trekDirectory = path.join(root, "_treks");
const trekFiles = (await fs.readdir(trekDirectory))
  .filter((name) => name.endsWith(".md"))
  .map((name) => path.join(trekDirectory, name));
const permalinks = new Map();

for (const file of trekFiles) {
  const source = await fs.readFile(file, "utf8");
  const fileLabel = relative(file);
  for (const key of ["title", "destination", "permalink", "status"]) {
    if (!frontMatterValue(source, key)) errors.push(`${fileLabel} : champ obligatoire manquant (${key})`);
  }

  const status = frontMatterValue(source, "status");
  if (status && !allowedStatuses.has(status)) {
    errors.push(`${fileLabel} : statut inconnu (${status})`);
  }

  const level = frontMatterValue(source, "level");
  if (level && (!Number.isInteger(Number(level)) || Number(level) < 1 || Number(level) > 5)) {
    errors.push(`${fileLabel} : le niveau doit être un entier compris entre 1 et 5`);
  }

  const permalink = frontMatterValue(source, "permalink");
  if (permalink) {
    if (permalinks.has(permalink)) {
      errors.push(`${fileLabel} : permalien déjà utilisé par ${permalinks.get(permalink)}`);
    } else {
      permalinks.set(permalink, fileLabel);
    }
  }

  if (!/^card_image:\s*\/assets\//m.test(source)) {
    errors.push(`${fileLabel} : image de carte manquante`);
  }
  if (!/^card_image_alt:\s*.+/m.test(source)) {
    errors.push(`${fileLabel} : texte alternatif de la carte manquant`);
  }
  if (!/^hero:\s*$/m.test(source) || !/^\s{2}alt:\s*.+/m.test(source)) {
    errors.push(`${fileLabel} : image principale ou texte alternatif manquant`);
  }
}

if (errors.length) {
  console.error(`Échec de la vérification (${errors.length} anomalie${errors.length > 1 ? "s" : ""}) :`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Vérification réussie : ${trekFiles.length} treks et ${files.length} fichiers contrôlés.`);
}
