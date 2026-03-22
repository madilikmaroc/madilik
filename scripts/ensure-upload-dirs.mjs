import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const segments = ["products", "banners", "categories", "reviews"];

for (const seg of segments) {
  await mkdir(path.join(root, "public", "uploads", seg), { recursive: true });
}
