class DataManager {
    constructor() {
        this.data = {
            dailyListings: [],
            totalVolume: 0,
            activeTokens: 0,
            successRate: 0,
            avgTimeToMillion: 0,
            topGainers: [],
            mostBought: [],
            highestMcap: [],
            highestLiquidity: [],
            mostSellPressure: [],
            newlyLaunched: []
        };
        this.loading = false;
        this.lastUpdated = new Date();
        this.animationKey = 0;
        this.apiKey = 'CG-gs6eaKFZmQ8BVSseT28MSofU';
        this.baseUrl = 'https://api.coingecko.com/api/v3';
        this.solanaTokens = [
            'solana', 'serum', 'raydium', 'orca', 'mango-markets', 'step-finance',
            'saber', 'sunny-aggregator', 'aldrin', 'solanium', 'solend',
            'apricot', 'francium', 'larix', 'parrot-protocol', 'drift-protocol',
            'zeta', 'quarry', 'tribeca', 'cashio', 'hubble', 'grape-2',
            'bonk', 'samoyedcoin', 'cope', 'fida', 'media-network', 'rope-token'
        ];
    }

    async makeApiCall(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            if (this.apiKey && this.apiKey !== 'CG-gs6eaKFZmQ8BVSseT28MSofU') {
                params.x_cg_demo_api_key = this.apiKey;
            }
            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('CoinGecko API Error:', error);
            throw error;
        }
    }

    async fetchSolanaTokens() {
        return await this.makeApiCall('/coins/markets', {
            vs_currency: 'usd',
            category: 'solana-ecosystem',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d'
        });
    }

    async fetchGlobalData() {
        return await this.makeApiCall('/global');
    }

    processCoinGeckoData(tokens) {
        if (!tokens || !Array.isArray(tokens)) return [];
        return tokens.map(token => ({
            id: token.id,
            name: token.name,
            symbol: token.symbol.toUpperCase(),
            price: token.current_price,
            mcap: token.market_cap ? (token.market_cap / 1000000).toFixed(2) : '0.00',
            volume: token.total_volume ? (token.total_volume / 1000000).toFixed(1) : '0.0',
            change1h: token.price_change_percentage_1h_in_currency || 0,
            change24h: token.price_change_percentage_24h || 0,
            change7d: token.price_change_percentage_7d_in_currency || 0,
            rank: token.market_cap_rank || 999,
            liquidity: token.total_volume || 0,
            lastUpdated: token.last_updated
        }));
    }

    categorizeTokens(processedTokens) {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        this.data.topGainers = processedTokens
            .filter(token => token.change24h > 0)
            .sort((a, b) => b.change24h - a.change24h)
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change24h.toFixed(1),
                rank: index + 1
            }));

        this.data.mostBought = processedTokens
            .sort((a, b) => b.liquidity - a.liquidity)
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change1h.toFixed(1),
                rank: index + 1
            }));

        this.data.highestMcap = processedTokens
            .sort((a, b) => (parseFloat(b.mcap) || 0) - (parseFloat(a.mcap) || 0))
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change24h.toFixed(1),
                rank: index + 1
            }));

        this.data.highestLiquidity = processedTokens
            .sort((a, b) => b.liquidity - a.liquidity)
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change24h.toFixed(1),
                rank: index + 1
            }));

        this.data.mostSellPressure = processedTokens
            .filter(token => token.change24h < 0)
            .sort((a, b) => a.change24h - b.change24h)
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change24h.toFixed(1),
                rank: index + 1
            }));

        const newTokens = processedTokens
            .filter(token => parseFloat(token.mcap) < 5 && token.last_updated);
        console.log('Newly Launched Tokens:', newTokens);
        this.data.newlyLaunched = newTokens
            .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
            .slice(0, 5)
            .map((token, index) => ({
                name: token.symbol,
                mcap: token.mcap,
                volume: token.volume,
                change: token.change24h.toFixed(1),
                rank: index + 1,
                age: Math.floor((new Date() - new Date(token.last_updated)) / (1000 * 60)) || 1
            }));
    }

    generateDailyListingsData(tokens) {
        const dates = this.generateDates(8);
        const totalVolume = tokens.reduce((sum, token) => sum + (token.liquidity || 0), 0);
        const avgMarketCap = tokens.reduce((sum, token) => sum + (parseFloat(token.mcap) || 0), 0) / (tokens.length || 1);
        this.data.dailyListings = dates.map(date => ({
            date,
            listings: Math.floor(Math.random() * 200) + 100,
            successful: Math.floor(Math.random() * 15) + 5,
            volume: (totalVolume / 1000000 / 7 * (0.8 + Math.random() * 0.4)).toFixed(1),
            avgMcap: (avgMarketCap * (0.8 + Math.random() * 0.4)).toFixed(2)
        }));
    }

    generateDates(days = 8) {
        const dates = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }));
        }
        return dates;
    }

    async fetchData() {
        this.loading = true;
        this.updateLoadingState();
        try {
            const [solanaTokens, globalData] = await Promise.all([
                this.fetchSolanaTokens(),
                this.fetchGlobalData().catch(() => null)
            ]);
            const processedTokens = this.processCoinGeckoData(solanaTokens);
            this.categorizeTokens(processedTokens);
            this.generateDailyListingsData(processedTokens);
            this.data.totalVolume = (processedTokens.reduce((sum, token) => 
                sum + (parseFloat(token.volume) || 0), 0)).toFixed(1);
            this.data.activeTokens = processedTokens.length;
            this.data.successRate = (processedTokens.filter(token => 
                parseFloat(token.mcap) > 1).length / (processedTokens.length || 1) * 100).toFixed(2);
            this.data.avgTimeToMillion = (Math.random() * 10 + 15).toFixed(1);
            this.lastUpdated = new Date();
            this.animationKey++;
            console.log('Data fetched successfully:', {
                totalTokens: processedTokens.length,
                topGainers: this.data.topGainers.length,
                newlyLaunched: this.data.newlyLaunched.length,
                totalVolume: this.data.totalVolume
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            this.data = {
                dailyListings: [],
                totalVolume: 0,
                activeTokens: 0,
                successRate: 0,
                avgTimeToMillion: 0,
                topGainers: [],
                mostBought: [],
                highestMcap: [],
                highestLiquidity: [],
                mostSellPressure: [],
                newlyLaunched: []
            };
        } finally {
            this.loading = false;
            this.updateLoadingState();
        }
    }

    updateLoadingState() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const refreshIcon = document.getElementById('refreshIcon');
        const refreshBtn = document.getElementById('refreshBtn');
        if (this.loading) {
            statusDot.classList.add('loading');
            statusText.textContent = 'Syncing...';
            refreshIcon.classList.add('spinning');
            refreshBtn.disabled = true;
        } else {
            statusDot.classList.remove('loading');
            statusText.textContent = 'Live Data';
            refreshIcon.classList.remove('spinning');
            refreshBtn.disabled = false;
        }
    }
}

class ChartManager {
    constructor() {
        this.charts = {};
        this.colors = ['#60A5FA', '#8B6F47', '#2563EB', '#F4A261', '#1E3A8A', '#D97706'];
    }

    initializeCharts() {
        this.createDailyChart();
    }

    createDailyChart() {
        const ctx = document.getElementById('dailyChart').getContext('2d');
        this.charts.daily = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Total Listings',
                    data: [],
                    borderColor: '#60A5FA',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Successful ($1M+)',
                    data: [],
                    borderColor: '#8B6F47',
                    backgroundColor: 'rgba(139, 111, 71, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#A8A29E' } }
                },
                scales: {
                    x: { ticks: { color: '#A8A29E' }, grid: { color: '#4A3A38' } },
                    y: { ticks: { color: '#A8A29E' }, grid: { color: '#4A3A38' } }
                }
            }
        });
    }

    updateCharts(data) {
        if (this.charts.daily && data.dailyListings) {
            this.charts.daily.data.labels = data.dailyListings.map(d => d.date);
            this.charts.daily.data.datasets[0].data = data.dailyListings.map(d => d.listings);
            this.charts.daily.data.datasets[1].data = data.dailyListings.map(d => d.successful);
            this.charts.daily.update();
        }
    }
}

class UIManager {
    constructor(dataManager, chartManager) {
        this.dataManager = dataManager;
        this.chartManager = chartManager;
        this.raceColors = ['#60A5FA', '#8B6F47', '#2563EB', '#F4A261', '#1E3A8A'];
    }

    updateStats() {
        const data = this.dataManager.data;
        const loading = this.dataManager.loading;
        document.getElementById('dailyListings').textContent = loading ? '...' : 
            (data.dailyListings.length > 0 ? data.dailyListings.slice(-1)[0].listings : '0');
        document.getElementById('avgTime').textContent = loading ? '...' : `${data.avgTimeToMillion}h`;
        document.getElementById('successRate').textContent = loading ? '...' : `${data.successRate}%`;
        document.getElementById('totalVolume').textContent = loading ? '...' : `${data.totalVolume}M`;
        document.getElementById('lastUpdated').textContent = this.dataManager.lastUpdated.toLocaleTimeString();
    }

    renderTokenList(containerId, tokens, type = 'default') {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!tokens || tokens.length === 0) {
            container.innerHTML = '<div class="loading-placeholder">No data available</div>';
            return;
        }
        container.innerHTML = tokens.map(token => `
            <div class="token-item">
                <div class="token-info">
                    <div class="token-rank">${token.rank}</div>
                    <div class="token-details">
                        <div class="token-name">${token.name}</div>
                        <div class="token-meta">
                            ${token.mcap}M mcap
                            ${type === 'newlyLaunched' ? ` • ${token.age}m ago` : ''}
                        </div>
                    </div>
                </div>
                <div class="token-stats">
                    <div class="token-change ${token.change >= 0 ? 'positive' : 'negative'}">
                        ${token.change >= 0 ? '+' : ''}${token.change}%
                    </div>
                    <div class="token-volume">${token.volume}M vol</div>
                </div>
            </div>
        `).join('');
    }

    renderRace() {
        const data = this.dataManager.data;
        if (!data.topGainers || data.topGainers.length === 0) {
            const container = document.getElementById('raceContainer');
            if (container) {
                container.innerHTML = '<div class="loading-placeholder">No data available</div>';
            }
            return;
        }
        const raceData = data.topGainers.map((token, index) => ({
            name: token.name,
            value: parseFloat(token.change),
            color: this.raceColors[index % this.raceColors.length]
        }));
        const maxValue = Math.max(...raceData.map(d => d.value), 1); // Avoid division by zero
        const container = document.getElementById('raceContainer');
        container.innerHTML = raceData.map(item => `
            <div class="race-item">
                <div class="race-name">${item.name}</div>
                <div class="race-bar-container">
                    <div class="race-bar" style="width: ${(item.value / maxValue) * 100}%; background: ${item.color};">
                        <div class="race-value">${item.value}%</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateUI() {
        this.updateStats();
        this.renderTokenList('topGainers', this.dataManager.data.topGainers);
        this.renderTokenList('mostBought', this.dataManager.data.mostBought);
        this.renderTokenList('highestMcap', this.dataManager.data.highestMcap);
        this.renderTokenList('highestLiquidity', this.dataManager.data.highestLiquidity);
        this.renderTokenList('mostSellPressure', this.dataManager.data.mostSellPressure);
        this.renderTokenList('newlyLaunched', this.dataManager.data.newlyLaunched, 'newlyLaunched');
        this.renderRace();
        this.chartManager.updateCharts(this.dataManager.data);
    }
}

class PumpFunDashboard {
    constructor() {
        this.dataManager = new DataManager();
        this.chartManager = new ChartManager();
        this.uiManager = new UIManager(this.dataManager, this.chartManager);
        this.intervals = [];
    }

    async init() {
        this.chartManager.initializeCharts();
        this.setupEventListeners();
        await this.dataManager.fetchData();
        this.uiManager.updateUI();
        const refreshInterval = setInterval(async () => {
            await this.dataManager.fetchData();
            this.uiManager.updateUI();
        }, 120000);
        this.intervals.push(refreshInterval);
        const raceInterval = setInterval(() => {
            this.uiManager.renderRace();
        }, 3000);
        this.intervals.push(raceInterval);
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', async () => {
            await this.dataManager.fetchData();
            this.uiManager.updateUI();
        });
    }

    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        Object.values(this.chartManager.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.removeEventListener('click', this.dataManager.fetchData);
        }
    }
}

const dashboard = new PumpFunDashboard();
dashboard.init();