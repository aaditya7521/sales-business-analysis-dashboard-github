// ==========================================
// SALES BUSINESS ANALYSIS DASHBOARD
// ==========================================


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let regionChart;
let productChart;
let monthlyChart;



// ==========================================
// CURRENCY FORMAT
// ==========================================

function formatCurrency(value) {

    return "\u20B9" + Number(value).toLocaleString("en-IN");

}



// ==========================================
// MONTH NAMES
// ==========================================

const monthNames = {

    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"

};



// ==========================================
// GET MONTH
// ==========================================

function getMonth(date) {

    const month = date.substring(5, 7);

    return monthNames[month];

}



// ==========================================
// POPULATE FILTERS
// ==========================================

function populateFilters() {

    const regionFilter =
        document.getElementById("regionFilter");

    const productFilter =
        document.getElementById("productFilter");

    const monthFilter =
        document.getElementById("monthFilter");


    const regions =
        [...new Set(
            salesData.map(order => order.region)
        )];


    const products =
        [...new Set(
            salesData.map(order => order.product)
        )];


    const months =
        [...new Set(
            salesData.map(order => getMonth(order.date))
        )];


    regions.forEach(region => {

        regionFilter.innerHTML +=
            `<option value="${region}">
                ${region}
            </option>`;

    });


    products.forEach(product => {

        productFilter.innerHTML +=
            `<option value="${product}">
                ${product}
            </option>`;

    });


    months.forEach(month => {

        monthFilter.innerHTML +=
            `<option value="${month}">
                ${month}
            </option>`;

    });

}



// ==========================================
// FILTER DATA
// ==========================================

function getFilteredData() {

    const selectedRegion =
        document.getElementById("regionFilter").value;

    const selectedProduct =
        document.getElementById("productFilter").value;

    const selectedMonth =
        document.getElementById("monthFilter").value;


    return salesData.filter(order => {

        const regionMatch =
            selectedRegion === "All" ||
            order.region === selectedRegion;


        const productMatch =
            selectedProduct === "All" ||
            order.product === selectedProduct;


        const monthMatch =
            selectedMonth === "All" ||
            getMonth(order.date) === selectedMonth;


        return (
            regionMatch &&
            productMatch &&
            monthMatch
        );

    });

}



// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals(data) {

    let totalSales = 0;

    let totalCost = 0;

    let totalProfit = 0;


    data.forEach(order => {

        totalSales += order.sales;

        totalCost += order.cost;

        totalProfit +=
            order.sales - order.cost;

    });


    return {

        totalSales,
        totalCost,
        totalProfit,
        totalOrders: data.length

    };

}



// ==========================================
// UPDATE KPI CARDS
// ==========================================

function updateKPIs(data) {

    const totals =
        calculateTotals(data);


    const averageOrder =
        totals.totalOrders > 0
            ? totals.totalSales / totals.totalOrders
            : 0;


    const margin =
        totals.totalSales > 0
            ? (totals.totalProfit /
                totals.totalSales) * 100
            : 0;


    document.getElementById("totalSales")
        .innerText =
        formatCurrency(totals.totalSales);


    document.getElementById("totalCost")
        .innerText =
        formatCurrency(totals.totalCost);


    document.getElementById("totalProfit")
        .innerText =
        formatCurrency(totals.totalProfit);


    document.getElementById("totalOrders")
        .innerText =
        totals.totalOrders;


    document.getElementById("averageOrder")
        .innerText =
        formatCurrency(averageOrder);


    document.getElementById("profitMargin")
        .innerText =
        margin.toFixed(2) + "%";


    updateBestProduct(data);

    updateBestRegion(data);

}



// ==========================================
// BEST PRODUCT
// ==========================================

function updateBestProduct(data) {

    const productSales = {};


    data.forEach(order => {

        if (!productSales[order.product]) {

            productSales[order.product] = 0;

        }

        productSales[order.product]
            += order.sales;

    });


    let bestProduct = "-";

    let highestSales = 0;


    for (let product in productSales) {

        if (
            productSales[product] >
            highestSales
        ) {

            highestSales =
                productSales[product];

            bestProduct =
                product;

        }

    }


    document.getElementById("bestProduct")
        .innerText =
        bestProduct;

}



// ==========================================
// BEST REGION
// ==========================================

function updateBestRegion(data) {

    const regionSales = {};


    data.forEach(order => {

        if (!regionSales[order.region]) {

            regionSales[order.region] = 0;

        }

        regionSales[order.region]
            += order.sales;

    });


    let bestRegion = "-";

    let highestSales = 0;


    for (let region in regionSales) {

        if (
            regionSales[region] >
            highestSales
        ) {

            highestSales =
                regionSales[region];

            bestRegion =
                region;

        }

    }


    document.getElementById("bestRegion")
        .innerText =
        bestRegion;

}



// ==========================================
// CREATE REGION DATA
// ==========================================

function getRegionSales(data) {

    const result = {};


    data.forEach(order => {

        if (!result[order.region]) {

            result[order.region] = 0;

        }

        result[order.region]
            += order.sales;

    });


    return result;

}



// ==========================================
// CREATE PRODUCT DATA
// ==========================================

function getProductSales(data) {

    const result = {};


    data.forEach(order => {

        if (!result[order.product]) {

            result[order.product] = 0;

        }

        result[order.product]
            += order.sales;

    });


    return result;

}



// ==========================================
// REGION CHART
// ==========================================

function updateRegionChart(data) {

    const regionSales =
        getRegionSales(data);


    if (regionChart) {

        regionChart.destroy();

    }


    regionChart =
        new Chart(
            document.getElementById(
                "regionChart"
            ),
            {

                type: "bar",

                data: {

                    labels:
                        Object.keys(regionSales),

                    datasets: [

                        {

                            label: "Sales",

                            data:
                                Object.values(
                                    regionSales
                                ),

                            borderRadius: 5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }
        );

}



// ==========================================
// PRODUCT CHART
// ==========================================

function updateProductChart(data) {

    const productSales =
        getProductSales(data);


    if (productChart) {

        productChart.destroy();

    }


    productChart =
        new Chart(
            document.getElementById(
                "productChart"
            ),
            {

                type: "doughnut",

                data: {

                    labels:
                        Object.keys(productSales),

                    datasets: [

                        {

                            data:
                                Object.values(
                                    productSales
                                )

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

}



// ==========================================
// MONTHLY CHART
// ==========================================

function updateMonthlyChart(data) {

    const monthlyData = {};


    data.forEach(order => {

        const month =
            getMonth(order.date);


        if (!monthlyData[month]) {

            monthlyData[month] = {

                sales: 0,

                profit: 0

            };

        }


        monthlyData[month].sales
            += order.sales;


        monthlyData[month].profit
            += order.sales - order.cost;

    });


    const labels =
        Object.keys(monthlyData);


    const sales =
        labels.map(
            month =>
                monthlyData[month].sales
        );


    const profit =
        labels.map(
            month =>
                monthlyData[month].profit
        );


    if (monthlyChart) {

        monthlyChart.destroy();

    }


    monthlyChart =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label: "Sales",

                            data: sales,

                            tension: 0.3,

                            fill: false

                        },

                        {

                            label: "Profit",

                            data: profit,

                            tension: 0.3,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }

        );

}



// ==========================================
// UPDATE TABLE
// ==========================================

function updateTable(data) {

    const table =
        document.getElementById(
            "salesTable"
        );


    table.innerHTML = "";


    data.forEach(order => {

        const profit =
            order.sales - order.cost;


        const row = `

            <tr>

                <td>${order.orderId}</td>

                <td>${order.date}</td>

                <td>${order.product}</td>

                <td>${order.category}</td>

                <td>${order.region}</td>

                <td>
                    ${formatCurrency(order.sales)}
                </td>

                <td>
                    ${formatCurrency(order.cost)}
                </td>

                <td class="profit-positive">
                    ${formatCurrency(profit)}
                </td>

            </tr>

        `;


        table.innerHTML += row;

    });


    if (data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="8"
                    style="text-align:center">

                    No data found for
                    selected filters.

                </td>

            </tr>

        `;

    }

}



// ==========================================
// PROFIT ANALYSIS
// ==========================================

function updateProfitAnalysis(data) {

    const totals =
        calculateTotals(data);


    const margin =
        totals.totalSales > 0
            ? (
                totals.totalProfit /
                totals.totalSales
            ) * 100
            : 0;


    document.getElementById(
        "analysisSales"
    ).innerText =
        formatCurrency(
            totals.totalSales
        );


    document.getElementById(
        "analysisCost"
    ).innerText =
        formatCurrency(
            totals.totalCost
        );


    document.getElementById(
        "analysisProfit"
    ).innerText =
        formatCurrency(
            totals.totalProfit
        );


    document.getElementById(
        "analysisMargin"
    ).innerText =
        margin.toFixed(2) + "%";


    const productProfit = {};


    data.forEach(order => {

        const profit =
            order.sales - order.cost;


        if (!productProfit[order.product]) {

            productProfit[order.product] = 0;

        }


        productProfit[order.product]
            += profit;

    });


    let highestProduct = "-";

    let lowestProduct = "-";

    let highestProfit = -Infinity;

    let lowestProfit = Infinity;


    for (let product in productProfit) {

        if (
            productProfit[product] >
            highestProfit
        ) {

            highestProfit =
                productProfit[product];

            highestProduct =
                product;

        }


        if (
            productProfit[product] <
            lowestProfit
        ) {

            lowestProfit =
                productProfit[product];

            lowestProduct =
                product;

        }

    }


    document.getElementById(
        "highestProfitProduct"
    ).innerText =
        highestProduct;


    document.getElementById(
        "lowestProfitProduct"
    ).innerText =
        lowestProduct;

}



// ==========================================
// BUSINESS INSIGHTS
// ==========================================

function updateInsights(data) {

    const totals =
        calculateTotals(data);


    const regionSales =
        getRegionSales(data);


    const productSales =
        getProductSales(data);


    let bestRegion = "-";

    let highestRegionSales = 0;


    for (let region in regionSales) {

        if (
            regionSales[region] >
            highestRegionSales
        ) {

            highestRegionSales =
                regionSales[region];

            bestRegion =
                region;

        }

    }


    let bestProduct = "-";

    let highestProductSales = 0;


    for (let product in productSales) {

        if (
            productSales[product] >
            highestProductSales
        ) {

            highestProductSales =
                productSales[product];

            bestProduct =
                product;

        }

    }


    const margin =
        totals.totalSales > 0
            ? (
                totals.totalProfit /
                totals.totalSales
            ) * 100
            : 0;


    const insightsBox =
        document.getElementById(
            "insightsBox"
        );


    if (data.length === 0) {

        insightsBox.innerHTML = `
            <div class="insight">
                No business insights available
                for the selected filters.
            </div>
        `;

        return;

    }


    insightsBox.innerHTML = `

        <div class="insight">

            <strong>Best Region:</strong>

            ${bestRegion}

            generated

            ${formatCurrency(
                highestRegionSales
            )}

            in sales.

        </div>


        <div class="insight">

            <strong>Best Product:</strong>

            ${bestProduct}

            generated

            ${formatCurrency(
                highestProductSales
            )}

            in sales.

        </div>


        <div class="insight">

            <strong>Profit Margin:</strong>

            ${margin.toFixed(2)}%

        </div>


        <div class="insight">

            <strong>Business Observation:</strong>

            The selected data generated

            ${formatCurrency(
                totals.totalProfit
            )}

            profit from

            ${formatCurrency(
                totals.totalSales
            )}

            in sales.

        </div>

    `;

}



// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const filteredData =
        getFilteredData();


    updateKPIs(filteredData);

    updateRegionChart(filteredData);

    updateProductChart(filteredData);

    updateMonthlyChart(filteredData);

    updateTable(filteredData);

    updateProfitAnalysis(filteredData);

    updateInsights(filteredData);

}



// ==========================================
// EXPORT CSV
// ==========================================

function exportCSV() {

    const data =
        getFilteredData();


    if (data.length === 0) {

        alert(
            "No data available to export."
        );

        return;

    }


    let csv =
        "Order ID,Date,Product,Category,Region,Sales,Cost,Profit\n";


    data.forEach(order => {

        const profit =
            order.sales - order.cost;


        csv +=
            `${order.orderId},` +
            `${order.date},` +
            `${order.product},` +
            `${order.category},` +
            `${order.region},` +
            `${order.sales},` +
            `${order.cost},` +
            `${profit}\n`;

    });


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "sales-analysis-report.csv";


    link.click();


    URL.revokeObjectURL(url);

}



// ==========================================
// PRINT REPORT
// ==========================================

function printReport() {

    window.print();

}



// ==========================================
// RESET FILTERS
// ==========================================

function resetFilters() {

    document.getElementById(
        "regionFilter"
    ).value = "All";


    document.getElementById(
        "productFilter"
    ).value = "All";


    document.getElementById(
        "monthFilter"
    ).value = "All";


    updateDashboard();

}



// ==========================================
// EVENT LISTENERS
// ==========================================

document.getElementById(
    "regionFilter"
).addEventListener(
    "change",
    updateDashboard
);


document.getElementById(
    "productFilter"
).addEventListener(
    "change",
    updateDashboard
);


document.getElementById(
    "monthFilter"
).addEventListener(
    "change",
    updateDashboard
);


document.getElementById(
    "resetFilters"
).addEventListener(
    "click",
    resetFilters
);


document.getElementById(
    "exportBtn"
).addEventListener(
    "click",
    exportCSV
);


document.getElementById(
    "printBtn"
).addEventListener(
    "click",
    printReport
);



// ==========================================
// START DASHBOARD
// ==========================================

populateFilters();

updateDashboard();
// ==========================================
// THEME TOGGLE
// ==========================================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {

        themeToggle.innerHTML = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.innerHTML = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

});


// Load saved theme
if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-theme");

    themeToggle.innerHTML = "☀️ Light Mode";

}


// ==========================================
// FULLSCREEN
// ==========================================

const fullscreenBtn = document.getElementById("fullscreenBtn");

fullscreenBtn.addEventListener("click", function () {

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen();

        fullscreenBtn.innerHTML = "✕ Exit Fullscreen";

    } else {

        document.exitFullscreen();

        fullscreenBtn.innerHTML = "⛶ Fullscreen";

    }

});
