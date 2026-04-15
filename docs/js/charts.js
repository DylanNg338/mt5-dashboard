let charts = {};

function updateCharts() {
    const symbols = dashboardData.symbols;
    
    Object.keys(symbols).forEach(symbol => {
        updateChart(symbol, symbols[symbol]);
    });
}

function updateChart(symbol, data) {
    if (!data || data.length === 0) return;
    
    const chartId = `chart-${symbol.toLowerCase()}`;
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    const chartData = {
        labels: data.map(d => new Date(d.time)),
        datasets: [{
            label: 'Close Price',
            data: data.map(d => d.close),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    };
    
    if (charts[symbol]) {
        charts[symbol].data = chartData;
        charts[symbol].update();
    } else {
        charts[symbol] = new Chart(ctx, config);
    }
}