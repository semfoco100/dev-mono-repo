import ftp, { enterPassiveModeIPv4, type AccessOptions, type Client, type FileInfo } from "basic-ftp";
import { Writable } from "node:stream";
import type { AppConfig } from "./config.js";

export type ConnectionMode = "ftp" | "ftps-explicit" | "ftps-implicit";

export type CatalogEntry = FileInfo & {
  path: string;
};

export type ConnectedAftpClient = {
  client: Client;
  mode: ConnectionMode;
};

export const FTP_TIMEOUT_MS = 120_000;

const MODES: Array<{ mode: ConnectionMode; options: Pick<AccessOptions, "secure" | "port"> }> = [
  { mode: "ftp", options: { secure: false, port: 21 } },
  { mode: "ftps-explicit", options: { secure: true, port: 21 } },
  { mode: "ftps-implicit", options: { secure: "implicit", port: 990 } }
];

export async function connectWithAutoDetection(config: AppConfig): Promise<ConnectedAftpClient> {
  const errors: string[] = [];

  for (const candidate of MODES) {
    const client = createClient(config);

    try {
      console.log(`[ftp] connect:start mode=${candidate.mode} host=${config.host} port=${candidate.options.port}`);
      await client.access({
        host: config.host,
        user: config.user,
        password: config.password,
        ...candidate.options
      });
      console.log(`[ftp] connect:ok mode=${candidate.mode}`);

      return { client, mode: candidate.mode };
    } catch (error) {
      console.log(`[ftp] connect:fail mode=${candidate.mode} error=${formatError(error)}`);
      client.close();
      errors.push(`${candidate.mode}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`Could not connect to ${config.host} using FTP/FTPS modes:\n${errors.join("\n")}`);
}

export function createClient(config: AppConfig): Client {
  const client = new ftp.Client(FTP_TIMEOUT_MS);
  client.ftp.verbose = config.verbose;
  client.prepareTransfer = enterPassiveModeIPv4;
  return client;
}

export async function connectWithMode(config: AppConfig, mode: ConnectionMode): Promise<ConnectedAftpClient> {
  const candidate = MODES.find((item) => item.mode === mode);

  if (!candidate) {
    throw new Error(`Unsupported FTP mode: ${mode}`);
  }

  const client = createClient(config);

  console.log(`[ftp] connect:start mode=${candidate.mode} host=${config.host} port=${candidate.options.port}`);
  await client.access({
    host: config.host,
    user: config.user,
    password: config.password,
    ...candidate.options
  });
  console.log(`[ftp] connect:ok mode=${candidate.mode}`);

  return { client, mode: candidate.mode };
}

export function toCatalogEntries(entries: FileInfo[], remoteDir: string): CatalogEntry[] {
  return entries.map((entry) => Object.assign(entry, { path: joinRemotePath(remoteDir, entry.name) }));
}

export function findMidGzipFiles(entries: CatalogEntry[], mid: string): CatalogEntry[] {
  return entries.filter((entry) => {
    const path = entry.path.toLowerCase();
    return entry.isFile && path.endsWith(".gz") && path.includes(mid.toLowerCase());
  });
}

export function findAnyGzipFile(entries: CatalogEntry[]): CatalogEntry | undefined {
  return entries.find((entry) => entry.isFile && entry.path.toLowerCase().endsWith(".gz"));
}

export async function downloadToBuffer(client: Client, remotePath: string): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const sink = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      callback();
    }
  });

  await client.downloadTo(sink, remotePath);
  return Buffer.concat(chunks);
}

function joinRemotePath(parent: string, child: string): string {
  if (parent === "/") {
    return `/${child}`;
  }

  return `${parent}/${child}`;
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
