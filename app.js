class SMCChartScannerApp {
    constructor() {
        this.currentImageFile = null;
        this.analysisResults = null;
        this.setupEventListeners();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        const uploadBox = document.getElementById('uploadBox');
        const imageInput = document.getElementById('imageInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const clearBtn = document.getElementById('clearBtn');

        // Upload box click
        uploadBox.addEventListener('click', () => imageInput.click());

        // Drag and drop
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('drag-over');
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('drag-over');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('drag-over');
            if (e.dataTransfer.files.length > 0) {
                this.handleImageUpload(e.dataTransfer.files[0]);
            }
        });

        // File input change
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        // Analyze button
        analyzeBtn.addEventListener('click', () => this.analyzeChart());

        // Clear button
        clearBtn.addEventListener('click', () => this.clearAll());
    }

    /**
     * Handle image upload
     */
    async handleImageUpload(file) {
        try {
            this.currentImageFile = file;
            const dataUrl = await imageProcessor.loadImage(file);

            // Show preview section
            document.getElementById('uploadBox').style.display = 'none';
            document.getElementById('previewSection').style.display = 'block';
            document.getElementById('resultsSection').style.display = 'none';

            // Load image into preview
            const previewImage = document.getElementById('previewImage');
            previewImage.src = dataUrl;
            previewImage.onload = () => {
                canvasTools.initCanvas(previewImage);
            };
        } catch (error) {
            alert('Error loading image: ' + error.message);
        }
    }

    /**
     * Analyze the chart
     */
    async analyzeChart() {
        try {
            // Show loading spinner
            document.getElementById('loadingSpinner').style.display = 'flex';
            document.getElementById('resultsSection').style.display = 'none';

            // Process image
            const previewImage = document.getElementById('previewImage');
            const chartData = await imageProcessor.analyzeChartImage(previewImage);

            // Analyze with SMC
            this.analysisResults = await smcAnalyzer.analyzeChart(chartData);

            // Draw on canvas
            canvasTools.drawZones(this.analysisResults.zones);
            canvasTools.drawPatterns(this.analysisResults.patterns);
            canvasTools.drawEntrySetup(this.analysisResults.entrySetup);

            // Display results
            this.displayResults();

            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error analyzing chart: ' + error.message);
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    }

    /**
     * Display analysis results
     */
    displayResults() {
        if (!this.analysisResults) return;

        // Display zones
        this.displayZones();

        // Display patterns
        this.displayPatterns();

        // Display entry setup
        this.displayEntrySetup();

        // Display entry reason
        this.displayEntryReason();

        // Display accuracy
        this.displayAccuracy();

        // Display trade summary
        this.displayTradeSummary();
    }

    /**
     * Display support/resistance zones
     */
    displayZones() {
        const zonesContainer = document.getElementById('zonesResult');
        zonesContainer.innerHTML = '';

        this.analysisResults.zones.forEach((zone, index) => {
            const zoneElement = document.createElement('div');
            zoneElement.className = `zone-item ${zone.type}`;
            zoneElement.innerHTML = `
                <div class="zone-type ${zone.type}">${zone.type.toUpperCase()}</div>
                <div class="zone-level">Price: ${zone.price} | Strength: ${zone.strength}% | Touches: ${zone.touches}</div>
            `;
            zonesContainer.appendChild(zoneElement);
        });
    }

    /**
     * Display detected patterns
     */
    displayPatterns() {
        const patternsContainer = document.getElementById('patternsResult');
        patternsContainer.innerHTML = '';

        this.analysisResults.patterns.forEach((pattern, index) => {
            const patternElement = document.createElement('div');
            patternElement.className = 'pattern-item';
            const directionEmoji = pattern.direction === 'bullish' ? '📈' : '📉';
            patternElement.innerHTML = `
                <div class="pattern-name">${directionEmoji} ${pattern.name}</div>
                <div class="pattern-strength">Strength: ${(pattern.strength * 100).toFixed(0)}% | ${pattern.timeframe} | ${pattern.direction}</div>
            `;
            patternsContainer.appendChild(patternElement);
        });
    }

    /**
     * Display entry setup
     */
    displayEntrySetup() {
        const setup = this.analysisResults.entrySetup;
        document.getElementById('entryPrice').textContent = setup.entryPrice;
        document.getElementById('takeProfitPrice').textContent = setup.takeProfitPrice;
        document.getElementById('stopLossPrice').textContent = setup.stopLossPrice;
        document.getElementById('rrRatio').textContent = `1:${setup.riskReward}`;
    }

    /**
     * Display entry reason
     */
    displayEntryReason() {
        const reasonElement = document.getElementById('entryReason');
        reasonElement.innerHTML = '• ' + this.analysisResults.entryReason.replace(/\n/g, '<br>• ');
    }

    /**
     * Display accuracy metrics
     */
    displayAccuracy() {
        const accuracy = this.analysisResults.accuracy;

        // Update progress bars
        document.getElementById('patternConfidence').style.width = accuracy.patternConfidence + '%';
        document.getElementById('patternConfidenceValue').textContent = accuracy.patternConfidence;

        document.getElementById('zoneAccuracy').style.width = accuracy.zoneAccuracy + '%';
        document.getElementById('zoneAccuracyValue').textContent = accuracy.zoneAccuracy;

        document.getElementById('signalQuality').style.width = accuracy.signalQuality + '%';
        document.getElementById('signalQualityValue').textContent = accuracy.signalQuality;

        // Update notes
        const notesElement = document.getElementById('accuracyNotes');
        notesElement.innerHTML = accuracy.notes.replace(/\n/g, '<br>');
    }

    /**
     * Display trade summary
     */
    displayTradeSummary() {
        const setup = this.analysisResults.entrySetup;
        const riskPercentage = setup.riskPercentage;
        const direction = setup.direction.toUpperCase();
        const summary = `
            <strong>Trade Direction:</strong> ${direction}<br>
            <strong>Entry Price:</strong> ${setup.entryPrice}<br>
            <strong>Take Profit:</strong> ${setup.takeProfitPrice} (Profit: ${this.calculateProfit(setup)}%)<br>
            <strong>Stop Loss:</strong> ${setup.stopLossPrice} (Loss: -${riskPercentage}%)<br>
            <strong>Risk/Reward:</strong> 1:${setup.riskReward}<br>
            <strong>Position Risk:</strong> ${riskPercentage}% of entry<br>
            <br>
            <strong>Strategy:</strong> ${direction === 'LONG' ? 'Buy at support, target resistance' : 'Sell at resistance, target support'}<br>
            <strong>Patterns Used:</strong> ${this.analysisResults.patterns.map(p => p.name).join(', ')}
        `;
        document.getElementById('tradeSummary').innerHTML = summary;
    }

    /**
     * Calculate profit percentage
     */
    calculateProfit(setup) {
        const entry = parseFloat(setup.entryPrice);
        const tp = parseFloat(setup.takeProfitPrice);
        const profit = ((tp - entry) / entry) * 100;
        return Math.abs(profit).toFixed(2);
    }

    /**
     * Clear all and reset
     */
    clearAll() {
        this.currentImageFile = null;
        this.analysisResults = null;

        // Reset UI
        document.getElementById('uploadBox').style.display = 'block';
        document.getElementById('previewSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('imageInput').value = '';
        document.getElementById('loadingSpinner').style.display = 'none';

        canvasTools.clearCanvas();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SMCChartScannerApp();
});