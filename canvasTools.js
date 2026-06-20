class CanvasTools {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.zones = [];
        this.patterns = [];
    }

    /**
     * Initialize canvas for annotations
     */
    initCanvas(imageElement) {
        this.canvas = document.getElementById('annotationCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = imageElement.width;
        this.canvas.height = imageElement.height;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
    }

    /**
     * Clear canvas
     */
    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Draw zones on canvas
     */
    drawZones(zones) {
        this.clearCanvas();
        this.zones = zones;

        zones.forEach((zone, index) => {
            const y = zone.level || (index * (this.canvas.height / zones.length));
            
            // Draw zone line
            this.ctx.strokeStyle = zone.type === 'support' ? '#dc2626' : '#16a34a';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw zone label
            const label = `${zone.type.toUpperCase()} - ${zone.price || 'N/A'}`;
            this.drawLabel(10, y - 10, label, zone.type === 'support' ? '#dc2626' : '#16a34a');
        });
    }

    /**
     * Draw patterns on canvas
     */
    drawPatterns(patterns) {
        this.patterns = patterns;

        patterns.forEach((pattern, index) => {
            const x = pattern.x || (this.canvas.width / patterns.length) * index;
            const y = pattern.y || this.canvas.height / 2;
            const color = pattern.direction === 'bullish' ? '#16a34a' : '#dc2626';

            // Draw pattern marker
            this.drawMarker(x, y, color, pattern.name);
        });
    }

    /**
     * Draw entry setup on canvas
     */
    drawEntrySetup(entrySetup) {
        if (!entrySetup) return;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw entry point
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.drawLabel(centerX + 15, centerY, `Entry: ${entrySetup.entryPrice}`, '#3b82f6');

        // Draw TP line
        const tpY = centerY - 50;
        this.ctx.strokeStyle = '#16a34a';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([2, 2]);
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX, tpY);
        this.ctx.stroke();
        this.drawLabel(centerX + 15, tpY, `TP: ${entrySetup.takeProfitPrice}`, '#16a34a');

        // Draw SL line
        const slY = centerY + 50;
        this.ctx.strokeStyle = '#dc2626';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(centerX, slY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.drawLabel(centerX + 15, slY, `SL: ${entrySetup.stopLossPrice}`, '#dc2626');
    }

    /**
     * Draw a marker on canvas
     */
    drawMarker(x, y, color, text) {
        const size = 12;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('★', x, y);

        if (text) {
            this.drawLabel(x + 20, y, text, color);
        }
    }

    /**
     * Draw label on canvas
     */
    drawLabel(x, y, text, color) {
        const padding = 5;
        const fontSize = 12;
        const fontFamily = 'Arial';

        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        const metrics = this.ctx.measureText(text);
        const width = metrics.width + padding * 2;
        const height = fontSize + padding * 2;

        // Draw background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(x - 2, y - 2, width, height);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - 2, y - 2, width, height);

        // Draw text
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x + padding, y + padding);
    }

    /**
     * Export annotated canvas as image
     */
    exportImage() {
        return this.canvas.toDataURL('image/png');
    }
}

const canvasTools = new CanvasTools();