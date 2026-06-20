class ImageProcessor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.originalImage = null;
    }

    /**
     * Load image from file and return as data URL
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File must be an image'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.originalImage = img;
                    resolve(e.target.result);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Extract chart data from image using edge detection and color analysis
     */
    async analyzeChartImage(imageElement) {
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageElement, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract dominant price levels (horizontal lines in chart)
        const priceLines = this.detectHorizontalLines(data, canvas.width, canvas.height);
        
        // Detect support/resistance zones
        const zones = this.identifyZones(priceLines);

        // Detect candlestick patterns
        const patterns = this.detectPatterns(data, canvas.width, canvas.height);

        return {
            priceLines,
            zones,
            patterns,
            imageWidth: canvas.width,
            imageHeight: canvas.height
        };
    }

    /**
     * Detect horizontal lines in the chart (price levels)
     */
    detectHorizontalLines(data, width, height) {
        const lines = [];
        const threshold = 0.7; // Threshold for detecting edges
        const minLineLength = width * 0.3; // Minimum line length

        for (let y = 0; y < height; y += 5) {
            let horizontalEdges = 0;
            let startX = null;
            let endX = null;

            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                const brightness = (r + g + b) / 3;
                const isEdge = brightness < 100 || brightness > 200;

                if (isEdge) {
                    if (startX === null) startX = x;
                    endX = x;
                    horizontalEdges++;
                }
            }

            const lineLength = endX - (startX || 0);
            if (lineLength > minLineLength && horizontalEdges > width * 0.1) {
                lines.push({
                    y: y,
                    startX: startX || 0,
                    endX: endX || width,
                    strength: horizontalEdges / width
                });
            }
        }

        return lines;
    }

    /**
     * Identify support and resistance zones from price lines
     */
    identifyZones(priceLines) {
        const zones = [];
        const clusterDistance = 50; // Group lines within 50px as one zone
        const sortedLines = [...priceLines].sort((a, b) => a.y - b.y);

        let clusters = [];
        for (let line of sortedLines) {
            if (clusters.length === 0) {
                clusters.push([line]);
            } else {
                const lastCluster = clusters[clusters.length - 1];
                if (Math.abs(line.y - lastCluster[lastCluster.length - 1].y) < clusterDistance) {
                    lastCluster.push(line);
                } else {
                    clusters.push([line]);
                }
            }
        }

        for (let cluster of clusters) {
            const avgY = cluster.reduce((sum, line) => sum + line.y, 0) / cluster.length;
            const avgStrength = cluster.reduce((sum, line) => sum + line.strength, 0) / cluster.length;
            
            zones.push({
                y: avgY,
                strength: avgStrength,
                lineCount: cluster.length
            });
        }

        return zones;
    }

    /**
     * Detect candlestick patterns
     */
    detectPatterns(data, width, height) {
        const patterns = [];
        
        // Simple pattern detection based on color concentration
        const gridSize = 50;
        const patternThreshold = 0.4;

        for (let py = 0; py < height - gridSize; py += gridSize) {
            for (let px = 0; px < width - gridSize; px += gridSize) {
                const pattern = this.analyzeRegion(data, width, px, py, gridSize);
                if (pattern.confidence > patternThreshold) {
                    patterns.push({
                        x: px + gridSize / 2,
                        y: py + gridSize / 2,
                        type: pattern.type,
                        confidence: pattern.confidence
                    });
                }
            }
        }

        return patterns;
    }

    /**
     * Analyze a region of the image for pattern characteristics
     */
    analyzeRegion(data, width, startX, startY, size) {
        let greenCount = 0;
        let redCount = 0;
        let totalPixels = 0;

        for (let y = startY; y < startY + size && y < data.length / (width * 4); y++) {
            for (let x = startX; x < startX + size && x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Detect green candles (bullish)
                if (g > r && g > b) {
                    greenCount++;
                }
                // Detect red candles (bearish)
                if (r > g && r > b) {
                    redCount++;
                }
                totalPixels++;
            }
        }

        const greenRatio = greenCount / totalPixels;
        const redRatio = redCount / totalPixels;
        const maxRatio = Math.max(greenRatio, redRatio);

        return {
            type: greenRatio > redRatio ? 'bullish' : 'bearish',
            confidence: maxRatio
        };
    }

    /**
     * Convert pixel positions to price levels (simplified)
     */
    pixelsToPriceRange(height, pixelY) {
        // This is a simplified conversion - in real scenario, would parse chart axis labels
        const topPrice = 1.5000;
        const bottomPrice = 1.4000;
        const pricePerPixel = (bottomPrice - topPrice) / height;
        return topPrice + (pixelY * pricePerPixel);
    }
}

const imageProcessor = new ImageProcessor();