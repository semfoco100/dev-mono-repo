import fs from "node:fs/promises";
import path from "node:path";
import { analyzeGzipCatalog } from "./analyzeCatalog.js";
import {
  connectWithMode,
  connectWithAutoDetection,
  downloadToBuffer,
  findAnyGzipFile,
  findMidGzipFiles,
  FTP_TIMEOUT_MS,
  toCatalogEntries,
  type ConnectedAftpClient,
  type CatalogEntry
} from "./aftpClient.js";
import type { AppConfig } from "./config.js";

const KNOWN_RAKUTEN_FILES = [
  "46796_4705156_mp.txt.gz",
  "46796_4705156_mp.xml.gz",
  "46796_4705156_mp_delta.txt.gz",
  "46796_4705156_mp_delta.xml.gz"
];

export async function runDiagnostic(config: AppConfig): Promise<void> {
  await fs.mkdir(config.downloadDir, { recursive: true });

  console.log(`[diagnostic] FTP timeout: ${FTP_TIMEOUT_MS / 1000}s`);
  console.log("[diagnostic] Passive mode: PASV IPv4 via basic-ftp prepareTransfer");
  console.log("[diagnostic] Recursive listing disabled for this run");

  const firstConnection = await connectWithAutoDetection(config);
  console.log(`Connected to ${config.host} using ${firstConnection.mode}`);

  const entries = await runListingDiagnostics(firstConnection, config);

  if (entries.length > 0) {
    printEntries(entries);

    const midMatches = findMidGzipFiles(entries, config.mid);
    console.log(`\n.gz files containing MID ${config.mid}: ${midMatches.length}`);
    midMatches.forEach((entry) => console.log(`- ${entry.path} (${formatBytes(entry.size)})`));

    const sample = midMatches[0] ?? findAnyGzipFile(entries);

    if (!sample) {
      console.log("\nNo .gz file found to download.");
      return;
    }

    await downloadAndAnalyze(config, firstConnection.mode, sample.path);
    return;
  }

  console.log("\n[diagnostic] Directory listing did not return usable entries.");
  console.log("[diagnostic] Trying known Rakuten/Nuuvem file names directly.");
  await tryKnownFiles(config, firstConnection.mode);
}

async function runListingDiagnostics(
  connection: ConnectedAftpClient,
  config: AppConfig
): Promise<CatalogEntry[]> {
  const rootEntries = await runStrategy("initial pwd/list('/')", async () => {
    return withConnectedClient(connection, async ({ client }) => {
      await logFtpOperation("pwd", () => client.pwd());
      await logFtpOperation("cwd /", () => client.cd("/"));
      const rootList = await logFtpOperation("list /", () => client.list("/"));
      return toCatalogEntries(rootList, "/");
    });
  });

  if (rootEntries && rootEntries.length > 0) {
    return rootEntries;
  }

  console.log("[diagnostic] list('/') failed or returned no entries; reconnecting before list('.').");
  const dotConnection = await connectWithMode(config, connection.mode);

  const dotEntries = await runStrategy("fallback pwd/list('.')", async () => {
    return withConnectedClient(dotConnection, async ({ client }) => {
      await logFtpOperation("pwd", () => client.pwd());
      await logFtpOperation("cwd /", () => client.cd("/"));
      const dotList = await logFtpOperation("list .", () => client.list("."));
      return toCatalogEntries(dotList, ".");
    });
  });

  return dotEntries ?? [];
}

async function tryKnownFiles(config: AppConfig, mode: ConnectedAftpClient["mode"]): Promise<void> {
  const candidatePaths = KNOWN_RAKUTEN_FILES.flatMap((fileName) => [fileName, `/${fileName}`]);
  const failures: string[] = [];

  for (const remotePath of candidatePaths) {
    console.log(`\n[diagnostic] direct-download strategy: ${remotePath}`);

    try {
      await downloadAndAnalyze(config, mode, remotePath);
      return;
    } catch (error) {
      const message = formatError(error);
      failures.push(`${remotePath}: ${message}`);
      console.log(`[diagnostic] direct-download failed: ${remotePath} error=${message}`);
    }
  }

  console.log("\n[diagnostic] No known file could be downloaded.");
  console.log("[diagnostic] Direct-download failures:");
  failures.forEach((failure) => console.log(`- ${failure}`));
}

async function downloadAndAnalyze(
  config: AppConfig,
  mode: ConnectedAftpClient["mode"],
  remotePath: string
): Promise<void> {
  const connection = await connectWithMode(config, mode);

  await withConnectedClient(connection, async ({ client }) => {
    await logFtpOperation("pwd", () => client.pwd());
    await logFtpOperation("cwd /", () => client.cd("/"));

    const compressed = await logFtpOperation(`download ${remotePath}`, () => downloadToBuffer(client, remotePath));
    const compressedPath = path.join(config.downloadDir, path.basename(remotePath));
    await fs.writeFile(compressedPath, compressed);

    const { decompressed, stats } = await analyzeGzipCatalog(compressed);
    const fallbackExt = stats.kind === "xml" ? ".xml" : ".txt";
    const decompressedPath = compressedPath.toLowerCase().endsWith(".gz")
      ? compressedPath.replace(/\.gz$/i, "")
      : `${compressedPath}${fallbackExt}`;
    await fs.writeFile(decompressedPath, decompressed);

    console.log("\nSample analysis");
    console.log(`- Remote file: ${remotePath}`);
    console.log(`- Saved compressed: ${compressedPath}`);
    console.log(`- Saved decompressed: ${decompressedPath}`);
    console.log(`- Compressed size: ${formatBytes(stats.compressedBytes)}`);
    console.log(`- Decompressed size: ${formatBytes(stats.decompressedBytes)}`);
    console.log(`- Encoding: ${stats.encoding}`);
    console.log(`- Detected format: ${stats.kind}`);
    console.log(`- Records: ${stats.recordCount}`);
    console.log(`- Lines: ${stats.lineCount}`);
    console.log(`- Preview:\n${stats.preview}`);
  });
}

async function withConnectedClient<T>(
  connection: ConnectedAftpClient,
  operation: (connection: ConnectedAftpClient) => Promise<T>
): Promise<T> {
  try {
    return await operation(connection);
  } finally {
    closeClient(connection);
  }
}

async function runStrategy<T>(label: string, operation: () => Promise<T>): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    console.log(`[diagnostic] strategy failed: ${label} error=${formatError(error)}`);
    return undefined;
  }
}

async function logFtpOperation<T>(label: string, operation: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();
  console.log(`[ftp] ${label}:start`);

  try {
    const result = await operation();
    const duration = Date.now() - startedAt;
    console.log(`[ftp] ${label}:ok durationMs=${duration}${formatResult(result)}`);
    return result;
  } catch (error) {
    const duration = Date.now() - startedAt;
    console.log(`[ftp] ${label}:fail durationMs=${duration} error=${formatError(error)}`);
    throw error;
  }
}

function closeClient(connection: ConnectedAftpClient): void {
  console.log(`[ftp] close:start mode=${connection.mode}`);
  connection.client.close();
  console.log(`[ftp] close:ok mode=${connection.mode}`);
}

function printEntries(entries: CatalogEntry[]): void {
  const dirs = entries.filter((entry) => entry.isDirectory).length;
  const files = entries.filter((entry) => entry.isFile).length;

  console.log(`\nListed ${entries.length} entries (${dirs} directories, ${files} files)`);

  for (const entry of entries) {
    const kind = entry.isDirectory ? "dir " : "file";
    const size = entry.isFile ? ` ${formatBytes(entry.size)}` : "";
    console.log(`[${kind}] ${entry.path}${size}`);
  }
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) {
    return "unknown";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatResult(result: unknown): string {
  if (Array.isArray(result)) {
    return ` entries=${result.length}`;
  }

  if (Buffer.isBuffer(result)) {
    return ` bytes=${result.byteLength}`;
  }

  if (typeof result === "string") {
    return ` value=${JSON.stringify(result)}`;
  }

  return "";
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
