import { loadConfig } from "./config.js";
import { runDiagnostic } from "./diagnosticWorker.js";

async function main(): Promise<void> {
  const config = loadConfig();
  await runDiagnostic(config);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
