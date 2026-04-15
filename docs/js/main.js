let dashboardData = null;

async function loadData() {
    try {
        const response = await fetch('data/dashboard_data.json?' + new Date().getTime());
        dashboardData = await response.json();
        updateDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function updateDashboard() {
    if (!dashboardData) return;
    
    // Update timestamp
    const lastUpdate = new Date(dashboardData.timestamp);
    document.getElementById('last-update').textContent = 
        `Last Update: ${lastUpdate.toLocaleString()}`;
    
    // Update account info
    const account = dashboardData.account;
    document.getElementById('balance').textContent = 
        `$${account.balance.toFixed(2)}`;
    document.getElementById('equity').textContent = 
        `$${account.equity.toFixed(2)}`;
    
    const profitEl = document.getElementById('profit');
    profitEl.textContent = `$${account.profit.toFixed(2)}`;
    profitEl.className = 'metric-value ' + 
        (account.profit >= 0 ? 'positive' : 'negative');
    
    document.getElementById('margin-level').textContent = 
        `${account.margin_level ? account.margin_level.toFixed(2) : '0'}%`;
    
    // Update positions table
    updatePositionsTable();
    
    // Update charts
    updateCharts();
}

function updatePositionsTable() {
    const positions = dashboardData.positions;
    const tableDiv = document.getElementById('positions-table');
    
    if (positions.length === 0) {
        tableDiv.innerHTML = '<p>No open positions</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Ticket</th>
                    <th>Symbol</th>
                    <th>Type</th>
                    <th>Volume</th>
                    <th>Open Price</th>
                    <th>Current Price</th>
                    <th>SL</th>
                    <th>TP</th>
                    <th>Profit</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    positions.forEach(pos => {
        const profitClass = pos.profit >= 0 ? 'profit-positive' : 'profit-negative';
        html += `
            <tr>
                <td>${pos.ticket}</td>
                <td>${pos.symbol}</td>
                <td>${pos.type}</td>
                <td>${pos.volume}</td>
                <td>${pos.price_open.toFixed(5)}</td>
                <td>${pos.price_current.toFixed(5)}</td>
                <td>${pos.sl ? pos.sl.toFixed(5) : '-'}</td>
                <td>${pos.tp ? pos.tp.toFixed(5) : '-'}</td>
                <td class="${profitClass}">$${pos.profit.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    tableDiv.innerHTML = html;
}

// Auto-refresh every 30 seconds
setInterval(loadData, 30000);

// Initial load
loadData();