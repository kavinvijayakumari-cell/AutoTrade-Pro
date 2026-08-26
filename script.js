/* =========================================================
   AUTOTRADE PRO
   AUTOMATIC TRADING SIMULATOR
   ========================================================= */


/* =========================================================
   INITIAL SETTINGS
   ========================================================= */

const INITIAL_BALANCE = 100000;

let balance = INITIAL_BALANCE;

let currentPrice = 1000;

let previousPrice = 1000;

let holdings = 0;

let averageBuyPrice = 0;

let totalInvestment = 0;

let totalRealizedProfit = 0;

let tradeHistory = [];

let priceHistory = [];

let autoTrading = false;

let marketTimer = null;

let toastTimer = null;

const SHORT_PERIOD = 5;

const LONG_PERIOD = 15;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const balanceEl =
    document.getElementById("balance");

const portfolioValueEl =
    document.getElementById(
        "portfolioValue"
    );

const totalProfitEl =
    document.getElementById(
        "totalProfit"
    );

const profitPercentageEl =
    document.getElementById(
        "profitPercentage"
    );

const holdingsEl =
    document.getElementById(
        "holdings"
    );

const currentPriceEl =
    document.getElementById(
        "currentPrice"
    );

const priceChangeEl =
    document.getElementById(
        "priceChange"
    );

const highPriceEl =
    document.getElementById(
        "highPrice"
    );

const lowPriceEl =
    document.getElementById(
        "lowPrice"
    );

const volumeEl =
    document.getElementById(
        "volume"
    );

const orderPriceEl =
    document.getElementById(
        "orderPrice"
    );

const orderValueEl =
    document.getElementById(
        "orderValue"
    );

const quantityEl =
    document.getElementById(
        "quantity"
    );

const shortMAEl =
    document.getElementById(
        "shortMA"
    );

const longMAEl =
    document.getElementById(
        "longMA"
    );

const signalEl =
    document.getElementById(
        "signal"
    );

const portfolioSharesEl =
    document.getElementById(
        "portfolioShares"
    );

const averagePriceEl =
    document.getElementById(
        "averagePrice"
    );

const portfolioCurrentPriceEl =
    document.getElementById(
        "portfolioCurrentPrice"
    );

const investmentEl =
    document.getElementById(
        "investment"
    );

const unrealizedPLEl =
    document.getElementById(
        "unrealizedPL"
    );

const tradeHistoryEl =
    document.getElementById(
        "tradeHistory"
    );

const tradeCountEl =
    document.getElementById(
        "tradeCount"
    );

const autoTradeToggle =
    document.getElementById(
        "autoTradeToggle"
    );

const buyBtn =
    document.getElementById(
        "buyBtn"
    );

const sellBtn =
    document.getElementById(
        "sellBtn"
    );

const plusBtn =
    document.getElementById(
        "plusBtn"
    );

const minusBtn =
    document.getElementById(
        "minusBtn"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const clearHistoryBtn =
    document.getElementById(
        "clearHistoryBtn"
    );

const toast =
    document.getElementById(
        "toast"
    );

const toastIcon =
    document.getElementById(
        "toastIcon"
    );

const toastTitle =
    document.getElementById(
        "toastTitle"
    );

const toastMessage =
    document.getElementById(
        "toastMessage"
    );

const chart =
    document.getElementById(
        "priceChart"
    );

const ctx =
    chart.getContext("2d");


/* =========================================================
   INITIAL PRICE HISTORY
   ========================================================= */

function createInitialPrices() {

    priceHistory = [];

    let price = 1000;


    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const movement =
            (
                Math.random() - 0.48
            ) * 15;


        price += movement;


        if (price < 850) {

            price = 850;

        }


        if (price > 1150) {

            price = 1150;

        }


        priceHistory.push(price);

    }


    currentPrice =
        priceHistory[
            priceHistory.length - 1
        ];


    previousPrice =
        currentPrice;

}


/* =========================================================
   FORMAT CURRENCY
   ========================================================= */

function formatCurrency(value) {

    return "₹" +
        Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value) {

    return Number(value).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   UPDATE MARKET PRICE
   ========================================================= */

function updateMarketPrice() {

    previousPrice =
        currentPrice;


    const randomMovement =
        (
            Math.random() - 0.47
        ) *
        (
            currentPrice * 0.012
        );


    currentPrice +=
        randomMovement;


    if (currentPrice < 500) {

        currentPrice = 500;

    }


    if (currentPrice > 2000) {

        currentPrice = 2000;

    }


    priceHistory.push(
        currentPrice
    );


    if (
        priceHistory.length > 80
    ) {

        priceHistory.shift();

    }


    updateMarketUI();

    updateMovingAverages();

    updatePortfolio();

    drawChart();

    checkAutoTrading();

    saveData();

}


/* =========================================================
   MARKET UI
   ========================================================= */

function updateMarketUI() {

    currentPriceEl.textContent =
        formatCurrency(
            currentPrice
        );


    orderPriceEl.textContent =
        formatCurrency(
            currentPrice
        );


    portfolioCurrentPriceEl.textContent =
        formatCurrency(
            currentPrice
        );


    let change =
        (
            (
                currentPrice -
                previousPrice
            ) /
            previousPrice
        ) * 100;


    if (
        !Number.isFinite(change)
    ) {

        change = 0;

    }


    priceChangeEl.textContent =
        (
            change >= 0
                ? "+"
                : ""
        ) +
        change.toFixed(2) +
        "%";


    priceChangeEl.className =
        change >= 0
            ? "positive"
            : "negative";


    const quantity =
        getQuantity();


    orderValueEl.textContent =
        formatCurrency(
            currentPrice *
            quantity
        );


    const recentPrices =
        priceHistory.slice(-40);


    const high =
        Math.max(
            ...recentPrices
        );


    const low =
        Math.min(
            ...recentPrices
        );


    highPriceEl.textContent =
        formatCurrency(high);


    lowPriceEl.textContent =
        formatCurrency(low);


    const volume =
        Math.floor(
            50000 +
            Math.random() *
            950000
        );


    volumeEl.textContent =
        formatNumber(volume);

}


/* =========================================================
   QUANTITY
   ========================================================= */

function getQuantity() {

    let quantity =
        parseInt(
            quantityEl.value
        );


    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    return quantity;

}


quantityEl.addEventListener(
    "input",
    function () {

        if (
            quantityEl.value < 1
        ) {

            quantityEl.value = 1;

        }


        updateMarketUI();

    }
);


plusBtn.addEventListener(
    "click",
    function () {

        quantityEl.value =
            getQuantity() + 1;


        updateMarketUI();

    }
);


minusBtn.addEventListener(
    "click",
    function () {

        const quantity =
            getQuantity();


        if (quantity > 1) {

            quantityEl.value =
                quantity - 1;

        }


        updateMarketUI();

    }
);


/* =========================================================
   BUY
   ========================================================= */

function buyStock(
    quantity = getQuantity(),
    automatic = false
) {

    quantity =
        parseInt(quantity);


    if (
        isNaN(quantity) ||
        quantity <= 0
    ) {

        showToast(
            "Error",
            "Enter a valid quantity.",
            "!"
        );

        return false;

    }


    const orderValue =
        currentPrice *
        quantity;


    if (
        orderValue > balance
    ) {

        showToast(
            "Insufficient Balance",
            "You don't have enough virtual cash.",
            "!"
        );

        return false;

    }


    const oldInvestment =
        averageBuyPrice *
        holdings;


    const newInvestment =
        currentPrice *
        quantity;


    const totalShares =
        holdings +
        quantity;


    averageBuyPrice =
        totalShares > 0
            ? (
                oldInvestment +
                newInvestment
            ) /
            totalShares
            : 0;


    holdings +=
        quantity;


    balance -=
        orderValue;


    totalInvestment =
        averageBuyPrice *
        holdings;


    addTrade(
        "BUY",
        quantity,
        currentPrice,
        0,
        automatic
    );


    showToast(
        "BUY Order Executed",
        `${quantity} share(s) bought at ${formatCurrency(currentPrice)}`,
        "✓"
    );


    updateAll();

    return true;

}


/* =========================================================
   SELL
   ========================================================= */

function sellStock(
    quantity = getQuantity(),
    automatic = false
) {

    quantity =
        parseInt(quantity);


    if (
        isNaN(quantity) ||
        quantity <= 0
    ) {

        showToast(
            "Error",
            "Enter a valid quantity.",
            "!"
        );

        return false;

    }


    if (
        quantity > holdings
    ) {

        showToast(
            "Cannot Sell",
            "You don't have enough shares.",
            "!"
        );

        return false;

    }


    const sellValue =
        currentPrice *
        quantity;


    const profit =
        (
            currentPrice -
            averageBuyPrice
        ) *
        quantity;


    balance +=
        sellValue;


    holdings -=
        quantity;


    totalRealizedProfit +=
        profit;


    if (
        holdings === 0
    ) {

        averageBuyPrice = 0;

        totalInvestment = 0;

    } else {

        totalInvestment =
            averageBuyPrice *
            holdings;

    }


    addTrade(
        "SELL",
        quantity,
        currentPrice,
        profit,
        automatic
    );


    showToast(
        "SELL Order Executed",
        `${quantity} share(s) sold at ${formatCurrency(currentPrice)}`,
        profit >= 0
            ? "✓"
            : "!"
    );


    updateAll();

    return true;

}


/* =========================================================
   BUY BUTTON
   ========================================================= */

buyBtn.addEventListener(
    "click",
    function () {

        buyStock();

    }
);


/* =========================================================
   SELL BUTTON
   ========================================================= */

sellBtn.addEventListener(
    "click",
    function () {

        sellStock();

    }
);


/* =========================================================
   MOVING AVERAGE
   ========================================================= */

function calculateMovingAverage(
    period
) {

    if (
        priceHistory.length <
        period
    ) {

        return currentPrice;

    }


    const prices =
        priceHistory.slice(
            -period
        );


    const total =
        prices.reduce(
            (
                sum,
                price
            ) =>
                sum + price,
            0
        );


    return total /
        prices.length;

}


/* =========================================================
   UPDATE MOVING AVERAGES
   ========================================================= */

function updateMovingAverages() {

    const shortMA =
        calculateMovingAverage(
            SHORT_PERIOD
        );


    const longMA =
        calculateMovingAverage(
            LONG_PERIOD
        );


    shortMAEl.textContent =
        formatCurrency(
            shortMA
        );


    longMAEl.textContent =
        formatCurrency(
            longMA
        );


    let signal = "HOLD";


    if (
        shortMA >
        longMA * 1.001
    ) {

        signal = "BUY";

    }


    else if (
        shortMA <
        longMA * 0.999
    ) {

        signal = "SELL";

    }


    signalEl.textContent =
        signal;


    signalEl.className =
        signal.toLowerCase();


    return signal;

}


/* =========================================================
   AUTO TRADING
   ========================================================= */

autoTradeToggle.addEventListener(
    "change",
    function () {

        autoTrading =
            autoTradeToggle.checked;


        if (
            autoTrading
        ) {

            showToast(
                "Auto Trading ON",
                "The strategy is now monitoring the market.",
                "🤖"
            );

        } else {

            showToast(
                "Auto Trading OFF",
                "Automatic orders have been stopped.",
                "⏸"
            );

        }

    }
);


/* =========================================================
   AUTO TRADING ENGINE
   ========================================================= */

function checkAutoTrading() {

    if (
        !autoTrading
    ) {

        return;

    }


    const signal =
        updateMovingAverages();


    const lastTrade =
        tradeHistory[0];


    if (lastTrade) {

        const elapsed =
            Date.now() -
            lastTrade.timestamp;


        if (
            elapsed < 10000
        ) {

            return;

        }

    }


    if (
        signal === "BUY" &&
        holdings === 0
    ) {

        const automaticQuantity =
            10;


        buyStock(
            automaticQuantity,
            true
        );


        return;

    }


    if (
        signal === "SELL" &&
        holdings > 0
    ) {

        sellStock(
            holdings,
            true
        );

    }


    if (
        holdings > 0 &&
        currentPrice >=
        averageBuyPrice * 1.03
    ) {

        sellStock(
            holdings,
            true
        );


        showToast(
            "Take Profit",
            "Position closed with profit.",
            "✓"
        );


        return;

    }


    if (
        holdings > 0 &&
        currentPrice <=
        averageBuyPrice * 0.97
    ) {

        sellStock(
            holdings,
            true
        );


        showToast(
            "Stop Loss",
            "Position closed to limit loss.",
            "!"
        );

    }

}


/* =========================================================
   ADD TRADE
   ========================================================= */

function addTrade(
    type,
    quantity,
    price,
    profit,
    automatic
) {

    const trade = {

        id:
            Date.now() +
            Math.random(),

        type,

        quantity,

        price,

        value:
            price *
            quantity,

        profit,

        automatic,

        timestamp:
            Date.now(),

        time:
            new Date().toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            )

    };


    tradeHistory.unshift(
        trade
    );


    if (
        tradeHistory.length > 50
    ) {

        tradeHistory.pop();

    }


    renderTradeHistory();

}


/* =========================================================
   RENDER TRADE HISTORY
   ========================================================= */

function renderTradeHistory() {

    if (
        tradeHistory.length === 0
    ) {

        tradeHistoryEl.innerHTML = `

            <tr class="empty-row">

                <td colspan="7">

                    <div class="empty-state">

                        <div>
                            📊
                        </div>

                        <p>
                            No trades yet
                        </p>

                        <span>
                            Start trading to see your activity here
                        </span>

                    </div>

                </td>

            </tr>

        `;


        tradeCountEl.textContent =
            "0 Trades";


        return;

    }


    tradeHistoryEl.innerHTML =
        tradeHistory.map(
            trade => {

                const typeClass =
                    trade.type === "BUY"
                        ? "buy-type"
                        : "sell-type";


                const profitHTML =
                    trade.type === "BUY"
                        ? `<span>—</span>`
                        : `
                            <span class="${
                                trade.profit >= 0
                                    ? "profit"
                                    : "loss"
                            }">

                                ${
                                    trade.profit >= 0
                                        ? "+"
                                        : ""
                                }

                                ${formatCurrency(
                                    trade.profit
                                )}

                            </span>
                        `;


                return `

                    <tr>

                        <td>
                            ${trade.time}
                        </td>


                        <td>

                            <span class="${typeClass}">
                                ${trade.type}
                            </span>

                            ${
                                trade.automatic
                                    ? `
                                        <small
                                            style="
                                                margin-left:5px;
                                                color:#7c3aed;
                                            ">
                                            🤖
                                        </small>
                                    `
                                    : ""
                            }

                        </td>


                        <td>
                            ${formatCurrency(
                                trade.price
                            )}
                        </td>


                        <td>
                            ${trade.quantity}
                        </td>


                        <td>
                            ${formatCurrency(
                                trade.value
                            )}
                        </td>


                        <td>
                            ${profitHTML}
                        </td>


                        <td>

                            <button
                                class="delete-trade-btn"
                                onclick="deleteTrade('${trade.id}')"
                                title="Delete Trade">

                                🗑

                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    tradeCountEl.textContent =
        `${tradeHistory.length} ${
            tradeHistory.length === 1
                ? "Trade"
                : "Trades"
        }`;

}


/* =========================================================
   DELETE INDIVIDUAL TRADE
   ========================================================= */

function deleteTrade(id) {

    const confirmed =
        confirm(
            "Delete this trade from history?"
        );


    if (!confirmed) {

        return;

    }


    const originalLength =
        tradeHistory.length;


    tradeHistory =
        tradeHistory.filter(
            trade =>
                String(trade.id) !==
                String(id)
        );


    if (
        tradeHistory.length ===
        originalLength
    ) {

        showToast(
            "Error",
            "Trade could not be found.",
            "!"
        );

        return;

    }


    saveData();

    renderTradeHistory();


    showToast(
        "Trade Deleted",
        "The selected trade was removed from history.",
        "🗑"
    );

}


/* =========================================================
   CLEAR ALL TRADE HISTORY
   ========================================================= */

clearHistoryBtn.addEventListener(
    "click",
    function () {

        if (
            tradeHistory.length === 0
        ) {

            showToast(
                "No History",
                "There are no trades to delete.",
                "!"
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all trade history?"
            );


        if (!confirmed) {

            return;

        }


        tradeHistory = [];


        saveData();

        renderTradeHistory();


        showToast(
            "History Cleared",
            "All trade history has been deleted.",
            "🗑"
        );

    }
);


/* =========================================================
   PORTFOLIO
   ========================================================= */

function updatePortfolio() {

    const marketValue =
        holdings *
        currentPrice;


    const portfolioValue =
        balance +
        marketValue;


    const unrealizedProfit =
        holdings > 0
            ? (
                currentPrice -
                averageBuyPrice
            ) *
            holdings
            : 0;


    const totalProfit =
        totalRealizedProfit +
        unrealizedProfit;


    const percentage =
        (
            totalProfit /
            INITIAL_BALANCE
        ) *
        100;


    balanceEl.textContent =
        formatCurrency(
            balance
        );


    portfolioValueEl.textContent =
        formatCurrency(
            portfolioValue
        );


    totalProfitEl.textContent =
        formatCurrency(
            totalProfit
        );


    profitPercentageEl.textContent =
        (
            percentage >= 0
                ? "+"
                : ""
        ) +
        percentage.toFixed(2) +
        "%";


    profitPercentageEl.style.color =
        totalProfit >= 0
            ? "var(--green)"
            : "var(--red)";


    holdingsEl.textContent =
        formatNumber(
            holdings
        );


    portfolioSharesEl.textContent =
        formatNumber(
            holdings
        );


    averagePriceEl.textContent =
        holdings > 0
            ? formatCurrency(
                averageBuyPrice
            )
            : "₹0.00";


    investmentEl.textContent =
        holdings > 0
            ? formatCurrency(
                totalInvestment
            )
            : "₹0.00";


    unrealizedPLEl.textContent =
        formatCurrency(
            unrealizedProfit
        );


    unrealizedPLEl.style.color =
        unrealizedProfit >= 0
            ? "var(--green)"
            : "var(--red)";

}


/* =========================================================
   CHART RESIZE
   ========================================================= */

function resizeCanvas() {

    const rect =
        chart.getBoundingClientRect();


    const ratio =
        window.devicePixelRatio ||
        1;


    chart.width =
        rect.width *
        ratio;


    chart.height =
        rect.height *
        ratio;


    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

}


/* =========================================================
   DRAW CHART
   ========================================================= */

function drawChart() {

    resizeCanvas();


    const width =
        chart.clientWidth;


    const height =
        chart.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    if (
        priceHistory.length < 2
    ) {

        return;

    }


    const prices =
        priceHistory.slice(-50);


    const minPrice =
        Math.min(
            ...prices
        );


    const maxPrice =
        Math.max(
            ...prices
        );


    const range =
        maxPrice -
        minPrice ||
        1;


    const paddingTop = 25;

    const paddingBottom = 30;


    const chartHeight =
        height -
        paddingTop -
        paddingBottom;


    /*
       Grid
    */

    ctx.lineWidth = 1;


    ctx.strokeStyle =
        getComputedStyle(
            document.body
        ).getPropertyValue(
            "--border"
        );


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const y =
            paddingTop +
            (
                chartHeight /
                4
            ) *
            i;


        ctx.beginPath();


        ctx.moveTo(
            0,
            y
        );


        ctx.lineTo(
            width,
            y
        );


        ctx.stroke();

    }


    /*
       Points
    */

    const points = [];


    prices.forEach(
        (
            price,
            index
        ) => {

            const x =
                (
                    index /
                    (
                        prices.length -
                        1
                    )
                ) *
                width;


            const y =
                paddingTop +
                (
                    1 -
                    (
                        price -
                        minPrice
                    ) /
                    range
                ) *
                chartHeight;


            points.push({
                x,
                y
            });

        }
    );


    /*
       Area
    */

    ctx.beginPath();


    ctx.moveTo(
        points[0].x,
        height
    );


    points.forEach(
        point => {

            ctx.lineTo(
                point.x,
                point.y
            );

        }
    );


    ctx.lineTo(
        points[
            points.length - 1
        ].x,
        height
    );


    ctx.closePath();


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "rgba(37, 99, 235, 0.18)"
    );


    gradient.addColorStop(
        1,
        "rgba(37, 99, 235, 0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fill();


    /*
       Main line
    */

    ctx.beginPath();


    points.forEach(
        (
            point,
            index
        ) => {

            if (
                index === 0
            ) {

                ctx.moveTo(
                    point.x,
                    point.y
                );

            } else {

                ctx.lineTo(
                    point.x,
                    point.y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#2563eb";


    ctx.lineWidth = 2.5;


    ctx.lineJoin =
        "round";


    ctx.lineCap =
        "round";


    ctx.stroke();


    /*
       Current price point
    */

    const lastPoint =
        points[
            points.length - 1
        ];


    ctx.beginPath();


    ctx.arc(
        lastPoint.x,
        lastPoint.y,
        4,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#2563eb";


    ctx.fill();


    /*
       Price label
    */

    ctx.font =
        "11px Segoe UI";


    ctx.fillStyle =
        getComputedStyle(
            document.body
        ).getPropertyValue(
            "--text"
        );


    ctx.fillText(
        formatCurrency(
            currentPrice
        ),
        Math.max(
            5,
            lastPoint.x - 75
        ),
        Math.max(
            15,
            lastPoint.y - 10
        )
    );


    drawTradeMarkers(
        prices,
        minPrice,
        range,
        chartHeight,
        paddingTop,
        width
    );

}


/* =========================================================
   TRADE MARKERS
   ========================================================= */

function drawTradeMarkers(
    prices,
    minPrice,
    range,
    chartHeight,
    paddingTop,
    width
) {

    const recentTrades =
        tradeHistory.slice(
            0,
            10
        );


    recentTrades.forEach(
        trade => {

            const difference =
                Date.now() -
                trade.timestamp;


            if (
                difference >
                10 *
                60 *
                1000
            ) {

                return;

            }


            const price =
                trade.price;


            if (
                price < minPrice ||
                price >
                minPrice + range
            ) {

                return;

            }


            const closestIndex =
                prices.reduce(
                    (
                        best,
                        value,
                        index
                    ) => {

                        const currentDifference =
                            Math.abs(
                                value -
                                price
                            );


                        const bestDifference =
                            Math.abs(
                                prices[best] -
                                price
                            );


                        return
                            currentDifference <
                            bestDifference
                                ? index
                                : best;

                    },
                    0
                );


            const x =
                (
                    closestIndex /
                    (
                        prices.length -
                        1
                    )
                ) *
                width;


            const y =
                paddingTop +
                (
                    1 -
                    (
                        price -
                        minPrice
                    ) /
                    range
                ) *
                chartHeight;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                trade.type === "BUY"
                    ? "#16a34a"
                    : "#dc2626";


            ctx.fill();

        }
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    title,
    message,
    icon = "✓"
) {

    toastTitle.textContent =
        title;


    toastMessage.textContent =
        message;


    toastIcon.textContent =
        icon;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   THEME
   ========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "autoTradeTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );


        themeBtn.textContent =
            "☀️";

    } else {

        document.body.classList.remove(
            "dark"
        );


        themeBtn.textContent =
            "🌙";

    }

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "autoTradeTheme",
            isDark
                ? "dark"
                : "light"
        );


        themeBtn.textContent =
            isDark
                ? "☀️"
                : "🌙";


        drawChart();

    }
);


/* =========================================================
   SAVE DATA
   ========================================================= */

function saveData() {

    const data = {

        balance,

        currentPrice,

        holdings,

        averageBuyPrice,

        totalInvestment,

        totalRealizedProfit,

        tradeHistory,

        priceHistory

    };


    localStorage.setItem(
        "autoTradeData",
        JSON.stringify(data)
    );

}


/* =========================================================
   LOAD DATA
   ========================================================= */

function loadData() {

    const saved =
        localStorage.getItem(
            "autoTradeData"
        );


    if (!saved) {

        createInitialPrices();

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        balance =
            data.balance ??
            INITIAL_BALANCE;


        currentPrice =
            data.currentPrice ??
            1000;


        previousPrice =
            currentPrice;


        holdings =
            data.holdings ??
            0;


        averageBuyPrice =
            data.averageBuyPrice ??
            0;


        totalInvestment =
            data.totalInvestment ??
            0;


        totalRealizedProfit =
            data.totalRealizedProfit ??
            0;


        tradeHistory =
            data.tradeHistory ??
            [];


        priceHistory =
            data.priceHistory ??
            [];


        if (
            priceHistory.length < 2
        ) {

            createInitialPrices();

        }

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );


        createInitialPrices();

    }

}


/* =========================================================
   RESET
   ========================================================= */

resetBtn.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "Reset your entire paper trading account?"
            );


        if (!confirmed) {

            return;

        }


        balance =
            INITIAL_BALANCE;


        currentPrice =
            1000;


        previousPrice =
            1000;


        holdings =
            0;


        averageBuyPrice =
            0;


        totalInvestment =
            0;


        totalRealizedProfit =
            0;


        tradeHistory =
            [];


        autoTrading =
            false;


        autoTradeToggle.checked =
            false;


        createInitialPrices();

        saveData();

        updateAll();


        showToast(
            "Account Reset",
            "Your virtual account has been reset.",
            "↻"
        );

    }
);


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAll() {

    updateMarketUI();

    updateMovingAverages();

    updatePortfolio();

    renderTradeHistory();

    drawChart();

}


/* =========================================================
   MARKET LOOP
   ========================================================= */

function startMarket() {

    clearInterval(
        marketTimer
    );


    marketTimer =
        setInterval(
            updateMarketPrice,
            2000
        );

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    function () {

        drawChart();

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key.toLowerCase() ===
            "b"
        ) {

            buyStock();

        }


        if (
            event.key.toLowerCase() ===
            "s"
        ) {

            sellStock();

        }


        if (
            event.key.toLowerCase() ===
            "a"
        ) {

            autoTradeToggle.checked =
                !autoTradeToggle.checked;


            autoTradeToggle.dispatchEvent(
                new Event(
                    "change"
                )
            );

        }

    }
);


/* =========================================================
   START APPLICATION
   ========================================================= */

function initializeApp() {

    loadTheme();

    loadData();

    updateAll();

    startMarket();


    console.log(
        "AutoTrade Pro started successfully."
    );

}


initializeApp();