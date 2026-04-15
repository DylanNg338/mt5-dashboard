function buildCharts(monthly) {

    if (!monthly || Object.keys(monthly).length === 0) {
        console.warn("No monthly data for charts");
        return;
    }

    const months = Object.keys(monthly).sort();

    // ✅ USE TRADE PROFIT (clean performance)
    const values = months.map(m => monthly[m].tradeProfit);

    console.log("Chart Months:", months);
    console.log("Chart Values:", values);

    const ctx = document.getElementById("chart-xauusd");

    if (!ctx) {
        console.error("Chart canvas not found!");
        return;
    }

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [{
                label: "Monthly Trading Profit",
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            }]
        },
        options: {
            responsive: true
        }
    });
}

// expose globally
window.buildCharts = buildCharts;