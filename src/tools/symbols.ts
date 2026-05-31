import axios from "axios";

export interface SymbolResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  description: string;
}

/**
 * TradingView 심볼 검색
 * 실제 운영 시 TRADINGVIEW_API_KEY 환경변수를 설정해 주세요.
 */
export async function searchSymbol(
  query: string,
  exchange?: string
): Promise<SymbolResult[]> {
  try {
    // TradingView 공개 심볼 검색 엔드포인트
    const url = `https://symbol-search.tradingview.com/symbol_search/`;
    const params: Record<string, string> = {
      text: query,
      type: "",
      exchange: exchange ?? "",
      lang: "ko",
    };

    const response = await axios.get(url, {
      params,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
      timeout: 5000,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.data as any[]).slice(0, 10).map((item: any) => ({
      symbol: item.symbol,
      name: item.full_name ?? item.symbol,
      exchange: item.exchange,
      type: item.type,
      description: item.description ?? "",
    }));
  } catch {
    // API 접근 불가 시 샘플 데이터 반환
    return getMockSymbols(query);
  }
}

function getMockSymbols(query: string): SymbolResult[] {
  const samples: SymbolResult[] = [
    { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", type: "stock", description: "애플" },
    { symbol: "005930", name: "삼성전자", exchange: "KRX", type: "stock", description: "Samsung Electronics" },
    { symbol: "BTCUSD", name: "Bitcoin", exchange: "BINANCE", type: "crypto", description: "비트코인" },
    { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", type: "stock", description: "테슬라" },
    { symbol: "035420", name: "NAVER", exchange: "KRX", type: "stock", description: "네이버" },
  ];
  return samples.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );
}
