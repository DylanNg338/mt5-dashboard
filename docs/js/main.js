function calculateAnalytics(history) {

    let totalProfit = 0;

    let wins = [];
    let losses = [];

    let totalDuration = 0;
    let tradeCount = 0;

    history.forEach(t => {

        const profit = Number(t.profit || 0);
        const type = t.type;

        // ONLY TRADES
        if (type === 0 || type === 1) {

            totalProfit += profit;

            if (profit > 0) wins.push(profit);
            if (profit < 0) losses.push(profit);

            // -----------------------------
            // TRADE DURATION FIX
            // -----------------------------
            if (t.time && t.time_close) {

                const open = new Date(t.time);
                const close = new Date(t.time_close);

                const duration = (close - open) / 1000; // seconds

                if (duration > 0) {
                    totalDuration += duration;
                    tradeCount++;
                }
            }
        }
    });

    const avgProfit = wins.length
        ? wins.reduce((a, b) => a + b, 0) / wins.length
        : 0;

    const avgLoss = losses.length
        ? losses.reduce((a, b) => a + b, 0) / losses.length
        : 0;

    const avgDuration = tradeCount
        ? totalDuration / tradeCount
        : 0;

    return {
        totalProfit,
        avgProfit,
        avgLoss,
        avgDuration
    };
}

// -----------------------------
// LOAD DATA
// -----------------------------
fetch("data/dashboard_data.json?t=" + new Date().getTime())
  .then(res => res.json())
  .then(json => {

    const account = json.account || {};
    const history = json.history || [];

    const stats = calculateAnalytics(history);

    // UI
    document.getElementById("balance").textContent =
        (account.balance ?? 0).toFixed(2);

    document.getElementById("profit").textContent =
        stats.totalProfit.toFixed(2);

    document.getElementById("avg-profit").textContent =
        stats.avgProfit.toFixed(2);

    document.getElementById("avg-loss").textContent =
        stats.avgLoss.toFixed(2);

    document.getElementById("avg-duration").textContent =
        (stats.avgDuration / 60).toFixed(1) + " min";

    // CHART
    buildCharts(history);
  })
  .catch(err => console.error(err));