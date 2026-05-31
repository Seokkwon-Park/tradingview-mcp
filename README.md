# TradingView MCP Server

Claude AI에서 TradingView 데이터를 조회할 수 있는 MCP(Model Context Protocol) 서버입니다.

## 기능

| 툴 | 설명 |
|---|---|
| `search_symbol` | 종목명 또는 티커로 심볼 검색 |
| `get_chart` | OHLCV 차트 데이터 조회 |
| `get_indicators` | RSI, MACD, 볼린저밴드 등 기술적 지표 계산 |
| `get_market_summary` | 주요 지수 시장 현황 조회 |

## 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/Seokkwon-Park/tradingview-mcp.git
cd tradingview-mcp

# 2. 의존성 설치
npm install

# 3. 빌드
npm run build
```

## Claude Desktop 설정

`claude_desktop_config.json` 파일에 아래 내용을 추가하세요.

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "tradingview": {
      "command": "node",
      "args": ["/절대경로/tradingview-mcp/dist/index.js"]
    }
  }
}
```

## 디버그 모드 실행

```bash
npm run dev
# node --inspect=9229 dist/index.js 로 실행됨
# Chrome에서 chrome://inspect 접속하여 디버거 연결
```

## 사용 예시

Claude에게 아래와 같이 질문할 수 있습니다.

- "삼성전자 일봉 차트 데이터 가져와줘"
- "AAPL RSI랑 MACD 지표 알려줘"
- "비트코인 심볼 검색해줘"
- "미국 주식시장 현황 요약해줘"

## 라이선스

MIT
