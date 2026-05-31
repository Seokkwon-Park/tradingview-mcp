import { createServer } from "./server.js";

async function main() {
  const server = createServer();
  await server.start();
  console.error("TradingView MCP 서버가 시작되었습니다.");
}

main().catch((error) => {
  console.error("서버 시작 오류:", error);
  process.exit(1);
});
