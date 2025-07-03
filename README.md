Pump.fun Launchpad Pulse
A fun, real-time analytics dashboard for tracking Solana ecosystem memecoins using the CoinGecko API. Check out live metrics like daily token listings, top gainers, and newly launched coins, all in a sleek brown and blue design that works on both desktop and mobile. This is an open-source project, and the source code, including the public CoinGecko API key, is freely accessible for anyone to explore!
View the Live Dashboard: https://pumpfun-dashoard.vercel.app/
Features
    • Real-Time Data: Pulls live Solana ecosystem token data from CoinGecko. 
    • Key Metrics:
        ◦ Daily token listings and success rates (market cap > $1M). 
        ◦ Total trading volume, active tokens, and average time to $1M market cap. 
        ◦ Top gainers, most bought, highest market cap, highest liquidity, most sell pressure, and newly launched coins. 
    • Visualizations:
        ◦ Line chart showing daily listings and successful tokens over 8 days. 
        ◦ Animated race bar for top performers’ 24-hour price changes. 
        ◦ Responsive token lists with rank, market cap, volume, and price change. 
    • UI Design:
        ◦ Elegant brown (#2A1F1D, #8B6F47) and blue (#60A5FA, #2563EB) color scheme. 
        ◦ Inter font for clear readability. 
        ◦ Hover effects, smooth transitions, and responsive layouts. 
    • Refresh Mechanism: Updates every 2 minutes, with a manual refresh button. 
Accessing the Dashboard
Just visit the live Vercel URL: [(https://pumpfun-dashoard.vercel.app/)](https://pumpfun-dashoard.vercel.app/)  No setup needed! The dashboard works in any modern browser (Chrome, Firefox, etc.).
For Developers
Want to fork or modify the project? Here’s how to deploy your own version on Vercel:
    1. Clone the Repository:
       git clone https://github.com/your-username/pump-fun-launchpad-pulse.git
       cd pump-fun-launchpad-pulse
    2. Push to GitHub:
        ◦ If you make changes (e.g., add your own CoinGecko API key in script.js), push them:
          git add .
          git commit -m "Update dashboard"
          git push origin main
    3. Deploy on Vercel:
        ◦ Sign up/log in at Vercel with your GitHub account. 
        ◦ Click “New Project” and import your pump-fun-launchpad-pulse repository. 
        ◦ Configure:
            ▪ Framework Preset: Select “Other” (static HTML/CSS/JS project). 
            ▪ Root Directory: Leave as ./ (files are in the root). 
            ▪ Build Settings: No build step needed; Vercel serves static files. 
        ◦ Click “Deploy” to get your own URL. 
        ◦ Note: The public API key in script.js may hit rate limits. Get your own free key at CoinGecko API to replace it. 
File Structure
pump-fun-launchpad-pulse/
├── index.html      # Main HTML file with dashboard structure
├── style.css       # CSS for styling and responsive design
├── script.js       # JavaScript for data fetching, processing, and UI updates
└── README.md       # Project documentation
Debugging
If sections (e.g., “Newly Launched Coins”) show “No data available”:
    1. Check Console Logs:
        ◦ Open DevTools (F12) and look for:
            ▪ CoinGecko API Error: ... (e.g., 429 Too Many Requests for rate limits). 
            ▪ Data fetched successfully: { totalTokens: X, newlyLaunched: Y, ... } (if newlyLaunched is 0, no tokens have market cap < $5M). 
            ▪ Newly Launched Tokens: [...] (shows filtered tokens). 
    2. Verify API Response:
        ◦ In DevTools’ Network tab, check the /coins/markets request for tokens with market_cap < 5,000,000. 
    3. Rate Limits: The public API key in script.js may hit CoinGecko’s free tier limits (~50 calls/minute). Fork the repo and use your own key if needed. 
Limitations
    • Public API Key: The CoinGecko API key is exposed in script.js. Heavy usage may hit rate limits, causing blank sections. Fork the repo and use your own key for better reliability. 
    • Data Availability: “Newly Launched Coins” may be empty if no Solana tokens have a market cap < $5M. 
    • Rate Limits: CoinGecko’s free tier (10,000 calls/month) may limit data updates during high traffic. 
    • Static Data: All data comes from the CoinGecko API (no mock data), so API failures result in empty sections. 
Future Improvements
    • Alternative APIs: Add Solana-specific APIs (e.g., Solscan, Raydium) for newer memecoins. 
    • Error Handling: Add retry logic for API failures or cache recent data. 
    • Custom Filters: Let users adjust market cap or timeframe for token lists. 
    • Data Export: Enable downloading token lists as CSV. 
Contributing
This is a fun, open-source project! To contribute:
    1. Fork the repository. 
    2. Create a feature branch (git checkout -b feature/your-feature). 
    3. Commit changes (git commit -m 'Add your feature'). 
    4. Push to the branch (git push origin feature/your-feature). 
    5. Open a pull request. 
License
This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgments
    • CoinGecko API for token data. 
    • Chart.js for charting. 
    • Inter Font for typography. 
    • Vercel for seamless hosting. 
