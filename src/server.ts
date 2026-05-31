import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchSymbol } from "./tools/symbols.js";
import { getChart } from "./tools/chart.js";
import { getIndicators } from "./tools/indicators.js";

export function createServer() {
  const server = new McpServer({
    name: "tradingview-mcp",
    version: "1.0.0",
  });

  // ─── 종목 검색 ───────────────────────────────────────────
  server.tool(
    "search_symbol",
    "티커 심볼 또는 종목명으로 TradingView 종목을 검색합니다.",
    {
      query: z.string().describe("검색어 (예: AAPL, 삼성전자, BTC)"),
      exchange: z.string().optional().describe("거래소 필터 (예: NASDAQ, KRX, BINANCE)"),
    },
    async ({ query, exchange }) => {
      const result = await searchSymbol(query, exchange);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ─── 차트 데이터 조회 ─────────────────────────────────────
  server.tool(
    "get_chart",
    "특정 종목의 OHLCV 차트 데이터를 가져옵니다.",
    {
      symbol: z.string().describe("종목 심볼 (예: NASDAQ:AAPL, KRX:005930)"),
      interval: z
        .enum(["1", "5", "15", "30", "60", "D", "W", "M"])
        .describe("차트 시간 단위 (1분~월봉)"),
      bars: z.number().optional().default(100).describe("가져올 봉 개수 (기본 100)"),
    },
    async ({ symbol, interval, bars }) => {
      const result = await getChart(symbol, interval, bars);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ─── 기술적 지표 조회 ─────────────────────────────────────
  server.tool(
    "get_indicators",
    "종목의 기술적 지표(RSI, MACD, 볼린저밴드 등)를 계산합니다.",
    {
      symbol: z.string().describe("종목 심볼 (예: NASDAQ:AAPL)"),
      interval: z
        .enum(["1", "5", "15", "30", "60", "D", "W", "M"])
        .describe("차트 시간 단위"),
      indicators: z
        .array(z.enum(["RSI", "MACD", "BB", "EMA", "SMA", "STOCH"]))
        .describe("계산할 지표 목록"),
    },
    async ({ symbol, interval, indicators }) => {
      const result = await getIndicators(symbol, interval, indicators);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // ─── 시장 요약 ───────────────────────────────────────────
  server.tool(
    "get_market_summary",
    "주요 지수(코스피, 나스닥, S&P500 등)의 현재 시장 현황을 가져옵니다.",
    {
      market: z
        .enum(["KRX", "US", "CRYPTO", "FOREX"])
        .describe("조회할 시장"),
    },
    async ({ market }) => {
      const summaries: Record<string, object> = {
        KRX: {
          market: "한국 주식시장 (KRX)",
          indices: ["KOSPI", "KOSDAQ", "KRX100"],
          note: "실시간 데이터는 TradingView API 키 설정 후 사용 가능합니다.",
        },
        US: {
          market: "미국 주식시장",
          indices: ["SPX", "NDX", "DJI", "VIX"],
          note: "실시간 데이터는 TradingView API 키 설정 후 사용 가능합니다.",
        },
        CRYPTO: {
          market: "암호화폐 시장",
          indices: ["BTCUSD", "ETHUSD", "TOTAL"],
          note: "실시간 데이터는 TradingView API 키 설정 후 사용 가능합니다.",
        },
        FOREX: {
          market: "외환 시장",
          indices: ["USDKRW", "EURUSD", "USDJPY"],
          note: "실시간 데이터는 TradingView API 키 설정 후 사용 가능합니다.",
        },
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(summaries[market], null, 2),
          },
        ],
      };
    }
  );

  return {
    start: async () => {
      const transport = new StdioServerTransport();
      await server.connect(transport);
    },
  };
}
