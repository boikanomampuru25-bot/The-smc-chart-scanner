# 🎯 SMC Chart Scanner

Advanced Smart Money Concepts (SMC) analysis tool for MT5 trading charts. Analyze screenshots directly in your browser with real-time zone detection, pattern recognition, and automated trade setup calculations.

## ✨ Features

### 📊 Chart Analysis
- **MT5 Screenshot Import**: Upload any MT5 chart screenshot directly
- **Support & Resistance Detection**: Automatic identification of key price levels
- **Zone Accuracy Metrics**: Confidence scoring based on zone touches and strength
- **Multi-Timeframe Support**: Analyze any timeframe from M5 to D1

### 🎯 SMC Pattern Recognition
- **Order Blocks**: Detect smart money accumulation/distribution zones
- **Fair Value Gaps (FVG)**: Identify liquidity voids waiting to be filled
- **Breaker Blocks**: Recognize market structure breaks
- **Market Structure Shifts**: Track higher highs/lows and lower highs/lows
- **Impulse Moves**: Identify strong directional moves

### 📈 Entry Setup Calculation
- **Automated Entry Price**: Based on zone confluence and pattern alignment
- **TP & SL Calculation**: Risk/reward optimized exit targets
- **Risk/Reward Ratio**: 1:1.5 minimum for trade quality
- **Position Risk Assessment**: Calculate risk percentage per trade

### 💡 Trading Intelligence
- **Entry Reason**: Detailed explanation of why the trade is being suggested
- **Pattern Confidence**: Individual confidence scores for each detected pattern
- **Zone Accuracy**: Accuracy percentage based on multiple touches
- **Signal Quality**: Overall trade setup quality rating
- **Trade Summary**: Comprehensive setup overview with all key metrics

### 🎨 Visual Annotations
- **Canvas Annotations**: Overlays on the uploaded chart showing:
  - Support/Resistance zones (dashed lines with labels)
  - Entry, TP, and SL levels
  - Pattern markers
  - Price labels
- **Color-Coded System**:
  - 🟢 Green: Support zones, Bullish patterns, Take Profit
  - 🔴 Red: Resistance zones, Bearish patterns, Stop Loss
  - 🔵 Blue: Entry points

## 🚀 Quick Start

### Online (No Installation)
1. Visit the live application in your browser
2. Click the upload box or drag & drop an MT5 screenshot
3. Click "Analyze Chart"
4. View detailed analysis results

### Local Setup
```bash
# Clone the repository
git clone https://github.com/boikanomampuru25-bot/The-smc-chart-scanner.git
cd The-smc-chart-scanner

# Open in your browser
# Simply open index.html in your browser, or use a local server:
python -m http.server 8000
# Then navigate to http://localhost:8000
```

## 📱 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🏗️ How It Works

### 1. Image Processing
- Analyzes uploaded MT5 screenshot
- Detects horizontal lines (price levels)
- Clusters lines into support/resistance zones
- Identifies candlestick patterns (bullish/bearish)

### 2. SMC Analysis
- Evaluates pattern types and strength
- Calculates zone confidence based on:
  - Number of touches
  - Zone strength (visual intensity)
  - Proximity to other key levels
- Determines market structure (impulsive vs corrective)

### 3. Entry Setup Calculation
- Aligns entry with strongest zone
- Calculates TP based on nearest resistance (for longs) or support (for shorts)
- Sets SL beyond recent swing high/low with buffer
- Ensures minimum 1:1 risk/reward ratio

### 4. Accuracy Metrics
- **Pattern Confidence**: 50-90% based on pattern count
- **Zone Accuracy**: 60-90% based on confirmed zones
- **Signal Quality**: Average of pattern confidence and zone accuracy

## 📊 Understanding Results

### Entry Price
Optimal entry level based on support/resistance zones and pattern alignment.

### Take Profit (TP)
- **Long trades**: Nearest resistance level above entry
- **Short trades**: Nearest support level below entry

### Stop Loss (SL)
- **Long trades**: Below recent swing low + buffer
- **Short trades**: Above recent swing high + buffer

### Risk/Reward Ratio
- Minimum recommended: 1:1.5
- Ideal: 1:2 or better
- Formula: (TP - Entry) / (Entry - SL)

## 📁 File Structure

```
The-smc-chart-scanner/
├── index.html          # Main HTML structure
├── styles.css          # UI styling and animations
├── app.js              # Main application logic
├── smcAnalyzer.js      # SMC pattern & zone analysis
├── imageProcessor.js   # Image processing & detection
├── canvasTools.js      # Canvas drawing & annotations
└── README.md           # This file
```

## 🔧 Technical Details

### Image Processing
- Uses HTML5 Canvas API for image manipulation
- Applies edge detection to find price levels
- Color analysis for bullish/bearish candle identification
- Sub-pixel accuracy for zone detection

### Pattern Detection
- Analyzes price action zones
- Evaluates pattern types against SMC framework
- Calculates confidence scores
- Generates entry/exit recommendations

### Accuracy Calculation
```
Pattern Confidence = 50 + (number_of_patterns × 10)
Zone Accuracy = 60 + (confirmed_zones × 10)
Signal Quality = (Pattern Confidence + Zone Accuracy) / 2
```

## ⚠️ Disclaimer

**EDUCATIONAL PURPOSE ONLY** - This tool is for learning and analysis purposes only.

- Not financial advice
- Past performance ≠ future results
- Always implement proper risk management
- Use stop losses on every trade
- Start with small position sizes
- Backtest all strategies before live trading
- Be responsible with your capital

## 🎯 Best Practices

1. **Multiple Confirmations**: Use alongside other indicators
2. **Trade With Trend**: Only long in uptrends, short in downtrends
3. **Zone Confluences**: Strongest signals when multiple zones align
4. **Minimum R/R**: Never take trades below 1:1.5
5. **Market Conditions**: Adjust position size based on volatility
6. **Risk Management**: Risk no more than 1-2% per trade

## 🚀 Future Enhancements

- [ ] Live MT5 data integration
- [ ] Multi-asset support (Stocks, Crypto, Commodities)
- [ ] Historical trade tracking
- [ ] Machine learning pattern recognition
- [ ] Mobile app version
- [ ] Real-time alerts
- [ ] Advanced zone filtering
- [ ] Custom indicator overlays
- [ ] Trade journal integration
- [ ] Community pattern library

## 📝 Usage Tips

### Getting Best Results
1. Use clear, high-resolution chart screenshots
2. Ensure chart includes current price action
3. Use consistent time frames (don't mix M5 with D1)
4. Include at least 20 candles for pattern recognition
5. Capture full-screen without UI overlays for best accuracy

### Chart Preparation
- Remove all indicators except price
- Use clean chart theme (light or dark)
- Include adequate history for context
- Ensure proper Y-axis scale visibility

## 🐛 Troubleshooting

**"Image not loading"**
- Check file format (PNG, JPG supported)
- Ensure image is not corrupted
- Try different browser

**"No zones detected"**
- Upload clearer screenshot
- Ensure chart bars are visible
- Try higher resolution image

**"Low accuracy scores"**
- Chart may need more history
- Try different timeframe screenshot
- Ensure clear price action patterns

## 📞 Support

For issues, suggestions, or contributions:
1. Open an issue on GitHub
2. Provide screenshot of the problem
3. Include steps to reproduce

## 📄 License

MIT License - Free for educational and personal use

## 🙏 Credits

Built with HTML5 Canvas, Vanilla JavaScript, and advanced image processing techniques.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development

**Remember**: Proper risk management and continuous learning are keys to trading success! 🎯