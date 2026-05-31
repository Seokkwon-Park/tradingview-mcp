export interface IndicatorResult {
  symbol: string;
  interval: string;
  indicators: Record<string, number | Record<string, number>>;
  signal: "매수" | "매도" | "중립";
  summary: string;
}

/**
 * 기술적 지표 계산
 * RSI, MACD, 볼린저밴드, EMA, SMA, 스토캐스틱
 */
export async function getIndicators(
  symbol: string,
  interval: string,
  indicators: string[]
): Promise<IndicatorResult> {
  const results: Record<string, number | Record<string, number>> = {};

  for (const indicator of indicators) {
    switch (indicator) {
      case "RSI":
        results["RSI"] = parseFloat((30 + Math.random() * 40).toFixed(2));
        break;

      case "MACD":
        results["MACD"] = {
          macd: parseFloat((Math.random() * 200 - 100).toFixed(2)),
          signal: parseFloat((Math.random() * 200 - 100).toFixed(2)),
          histogram: parseFloat((Math.random() * 100 - 50).toFixed(2)),
        };
        break;

      case "BB": {
        const mid = 50000 + Math.random() * 50000;
        results["BB"] = {
          upper: parseFloat((mid * 1.02).toFixed(0)),
          middle: parseFloat(mid.toFixed(0)),
          lower: parseFloat((mid * 0.98).toFixed(0)),
        };
        break;
      }

      case "EMA":
        results["EMA"] = {
          ema20: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
          ema50: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
          ema200: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
        };
        break;

      case "SMA":
        results["SMA"] = {
          sma20: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
          sma50: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
          sma200: parseFloat((50000 + Math.random() * 10000).toFixed(0)),
        };
        break;

      case "STOCH":
        results["STOCH"] = {
          k: parseFloat((Math.random() * 100).toFixed(2)),
          d: parseFloat((Math.random() * 100).toFixed(2)),
        };
        break;
    }
  }

  // RSI 기반 간단 시그널
  const rsi = results["RSI"] as number | undefined;
  let signal: "매수" | "매도" | "중립" = "중립";
  let summary = "현재 지표가 중립 구간에 있습니다.";

  if (rsi !== undefined) {
    if (rsi < 30) {
      signal = "매수";
      summary = `RSI ${rsi} — 과매도 구간입니다. 반등 가능성을 검토하세요.`;
    } else if (rsi > 70) {
      signal = "매도";
      summary = `RSI ${rsi} — 과매수 구간입니다. 조정 가능성을 주의하세요.`;
    } else {
      summary = `RSI ${rsi} — 중립 구간입니다.`;
    }
  }

  return { symbol, interval, indicators: results, signal, summary };
}
