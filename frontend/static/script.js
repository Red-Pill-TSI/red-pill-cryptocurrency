$(document).ready(function () {
  // Initialize the cryptocurrencies table.
  const table = $("#cryptocurrencies").DataTable({
    data: generateCoinData(),
    order: [],
    layout: {
      topStart: "search",
      topEnd: null,
      bottomStart: "paging",
      bottomEnd: null,
    },
    columns: [
      {
        data: "imageUrl",
        orderable: false,
        searchable: false,
        className: "text-center",
        render: function (data) {
          return `<img width="24" height="24" src="${data}" />`;
        },
      },
      { data: "name" },
      { data: "symbol" },
      {
        data: "price",
        render: function (data) {
          return "$" + data;
        },
      },
    ],
  });

  $("#cryptocurrencies tbody").on("click", "tr", function (e) {
    table
      .rows(".selected")
      .nodes()
      .each((row) => row.classList.remove("selected"));

    const classList = e.currentTarget.classList;
    classList.add("selected");

    const data = table.row(this).data();
    console.log(data);
  });

  // Initialize the crypctocurrency rate charts.
  // TODO: Use appropriate chart type and data.
  const chartData = generateChartData();
  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: chartData.map((row) => row.year),
      datasets: [
        {
          label: "Price, USD",
          data: chartData.map((row) => row.price),
          tension: 0.5,
        },
      ],
    },
  });

  // Initialize the currency selection control.
  // TODO: Actually change the displayed currency on change.
  $("#currencySelect").change(function () {
    const selectedCurrency = $(this).val();
    console.log(`Changed currency to '${selectedCurrency}'`);
  });

  // Initialize the subscription submit button.
  // TODO: Actually register the email for notifications.
  $("#subscribe").submit(function (event) {
    event.preventDefault();
    const email = $("#subscribe :input[name='email']").val();
    console.log(`Subscribing to '${email}'`);
  });
});

// Obtained from: https://www.coingecko.com/
// Note: For testing purposes only; remove once properly integrated with their API.
function generateCoinData() {
  return [
    {
      name: "Bitcoin",
      symbol: "BTC",
      imageUrl:
        "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400",
      price: "63,471.79",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      imageUrl:
        "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
      price: "3,101.60",
    },
    {
      name: "Tether",
      symbol: "USDT",
      imageUrl:
        "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
      price: "0.9978",
    },
    {
      name: "BNB",
      symbol: "BNB",
      imageUrl:
        "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970",
      price: "587.85",
    },
    {
      name: "Solana",
      symbol: "SOL",
      imageUrl:
        "https://assets.coingecko.com/coins/images/4128/standard/solana.png?1696504756",
      price: "151.53",
    },
    {
      name: "USDC",
      symbol: "USDC",
      imageUrl:
        "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
      price: "0.9992",
    },
    {
      name: "XRP",
      symbol: "XRP",
      imageUrl:
        "https://assets.coingecko.com/coins/images/44/standard/xrp-symbol-white-128.png?1696501442",
      price: "0.5291",
    },
    {
      name: "Lido Staked Ether",
      symbol: "STETH",
      imageUrl:
        "https://assets.coingecko.com/coins/images/13442/standard/steth_logo.png?1696513206",
      price: "3,098.77",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      imageUrl:
        "https://assets.coingecko.com/coins/images/5/standard/dogecoin.png?1696501409",
      price: "0.1583",
    },
    {
      name: "Toncoin",
      symbol: "TON",
      imageUrl:
        "https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png?1696517498",
      price: "5.91",
    },
  ];
}

function generateChartData() {
  return [
    { year: 2010, price: 62431.79 },
    { year: 2011, price: 54359.79 },
    { year: 2012, price: 59872.79 },
    { year: 2013, price: 54622.79 },
    { year: 2014, price: 54722.79 },
    { year: 2015, price: 58672.79 },
    { year: 2016, price: 65342.79 },
  ];
}
