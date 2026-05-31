export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  symbol: string;
  interval: string;
  candles: Candle[];
}

/**
 * OHLCV 차트 데이터 조회
 * 실제 운영 시 TradingView Data API 또는 별도 데이터 제공업체와 연동하세요.
 */
export async function getChart(
  symbol: string,
  interval: string,
  bars: number
): Promise<ChartData> {
  // 샘플 데이터 생성 (실제 운영 시 API 호출로 교체)
  const candles = generateMockCandles(bars);

  return {
    symbol,
    interval,
    candles,
  };
}

function generateMockCandles(count: number): Candle[] {
  const candles: Candle[] = [];
  let price = 50000 + Math.random() * 50000;
  const now = Date.now();
  const intervalMs = 60 * 60 * 1000; // 1시간

  for (let i = count - 1; i >= 0; i--) {
    const change = (Math.random() - 0.5) * price * 0.03;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    const time = new Date(now - i * intervalMs).toISOString();

    candles.push({
      time,
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume,
    });

    price = close;
  }

  return candles;
}
