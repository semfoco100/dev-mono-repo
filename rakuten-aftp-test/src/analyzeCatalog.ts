import { gunzip } from "node:zlib";
import { promisify } from "node:util";

const gunzipAsync = promisify(gunzip);

export type CatalogKind = "xml" | "txt" | "unknown";

export type CatalogStats = {
  compressedBytes: number;
  decompressedBytes: number;
  encoding: "utf-8-bom" | "utf-8" | "latin1";
  kind: CatalogKind;
  recordCount: number;
  lineCount: number;
  preview: string;
};

export async function analyzeGzipCatalog(compressed: Buffer): Promise<{ decompressed: Buffer; stats: CatalogStats }> {
  const decompressed = await gunzipAsync(compressed);
  const encoding = detectEncoding(decompressed);
  const text = decodeBuffer(decompressed, encoding);
  const kind = detectKind(text);

  return {
    decompressed,
    stats: {
      compressedBytes: compressed.byteLength,
      decompressedBytes: decompressed.byteLength,
      encoding,
      kind,
      recordCount: countRecords(text, kind),
      lineCount: countLines(text),
      preview: text.slice(0, 500)
    }
  };
}

function detectEncoding(buffer: Buffer): CatalogStats["encoding"] {
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return "utf-8-bom";
  }

  const decoded = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
  return decoded.includes("\uFFFD") ? "latin1" : "utf-8";
}

function decodeBuffer(buffer: Buffer, encoding: CatalogStats["encoding"]): string {
  if (encoding === "latin1") {
    return buffer.toString("latin1");
  }

  return buffer.toString("utf8").replace(/^\uFEFF/, "");
}

function detectKind(text: string): CatalogKind {
  const firstContent = text.trimStart();

  if (firstContent.startsWith("<")) {
    return "xml";
  }

  if (firstContent.length > 0) {
    return "txt";
  }

  return "unknown";
}

function countRecords(text: string, kind: CatalogKind): number {
  if (kind === "xml") {
    const productTags = text.match(/<product\b/gi);
    const itemTags = text.match(/<item\b/gi);
    const recordTags = text.match(/<record\b/gi);
    return productTags?.length ?? itemTags?.length ?? recordTags?.length ?? 0;
  }

  if (kind === "txt") {
    return text.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  }

  return 0;
}

function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }

  return text.split(/\r?\n/).length;
}
