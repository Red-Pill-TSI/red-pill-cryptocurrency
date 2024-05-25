let table = undefined;
let ohlcChart = undefined;
let marketChart = undefined;
let selectedCryptocurrency = undefined;

$(document).ready(async function () {
  initializeCryptocurrencyTable();
  initializeCryptocurrencyChart();
  initializeCurrencySelector();
  initializeSubscriptionForm();
  await refresh();
});

async function refresh() {
  try {
    await refreshTable();
    if (selectedCryptocurrency) {
      await refreshCharts();
    }
  } catch (err) {
    showRequestLimitAlert();
  }
}

async function refreshTable() {
  const currency = $("#currencySelect").val();
  const data = await fetchTableData(currency);
  updateCryptocurrencyTable(data);
}

async function refreshCharts() {
  const currency = $("#currencySelect").val();

  const ohlcData = await fetchOhlcData(selectedCryptocurrency.id, currency);
  updateOhlcChart(ohlcData);

  const marketData = await fetchMarketChartData(
    selectedCryptocurrency.id,
    currency
  );
  updateMarketChart(marketData);
}

function initializeCryptocurrencyTable() {
  table = $("#crypto-table").DataTable({
    layout: {
      topStart: "search",
      topEnd: null,
      bottomStart: "paging",
      bottomEnd: null,
    },
    columns: [
      { data: "position" },
      {
        data: "image",
        orderable: false,
        searchable: false,
        className: "text-center",
        render: (value) => `<img width="24" height="24" src="${value}" />`,
      },
      { data: "name" },
      { data: "symbol", render: (value) => value.toUpperCase() },
      { data: "price", render: (value) => formatPrice(value) },
    ],
  });

  $("#crypto-table tbody").on("click", "tr", async function (e) {
    const previous = table.rows(".selected").nodes().get(0);
    const current = e.currentTarget;

    if (current !== previous) {
      current.classList.add("selected");
      if (previous) {
        previous.classList.remove("selected");
      }

      try {
        selectedCryptocurrency = table.row(this).data();
        await refreshCharts();
      } catch (err) {
        showRequestLimitAlert();
      }
    }
  });
}

function updateCryptocurrencyTable(data) {
  table.clear();
  table.rows.add(data).draw();
}

function updateOhlcChart(data) {
  const currency = $("#currencySelect").val().toUpperCase();
  ohlcChart.data.datasets[0].data = data;
  if (selectedCryptocurrency) {
    ohlcChart.options.plugins.title.text = `${selectedCryptocurrency.name} OHLC (${currency})`;
  } else {
    ohlcChart.options.plugins.title.text = `OHLC`;
  }
  ohlcChart.update();
}

function updateMarketChart(data) {
  const currency = $("#currencySelect").val().toUpperCase();
  marketChart.data.datasets[0].data = data;
  if (selectedCryptocurrency) {
    marketChart.options.plugins.title.text = `${selectedCryptocurrency.name} Prices (${currency})`;
  } else {
    marketChart.options.plugins.title.text = `Prices`;
  }
  marketChart.update();
}

function initializeCryptocurrencyChart() {
  ohlcChart = new Chart(document.getElementById("crypto-chart-ohlc"), {
    type: "candlestick",
    data: {
      datasets: [{ data: [] }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "OHLC" },
      },
    },
  });

  marketChart = new Chart(document.getElementById("crypto-chart-market"), {
    type: "line",
    data: {
      datasets: [{ data: [], pointRadius: 0 }],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Price" },
      },
      scales: {
        x: {
          type: "time",
        },
      },
    },
  });
}

function initializeCurrencySelector() {
  $("#currencySelect").change(function () {
    refresh();
  });
}

function initializeSubscriptionForm() {
  // TODO: Actually register the email for notifications.
  $("#subscribe").submit(function (event) {
    event.preventDefault();
    const email = $("#subscribe :input[name='email']").val();
    console.log(`Subscribing to '${email}'`);
  });
}

async function fetchTableData(currency) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return transformTableData(data);
}

function transformTableData(data) {
  return data.map((coin, index) => ({
    id: coin.id,
    name: coin.name,
    image: coin.image,
    price: coin.current_price,
    symbol: coin.symbol,
    position: index + 1,
  }));
}

async function fetchOhlcData(id, currency) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=${currency}&days=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return transformOhlcData(data);
}

function transformOhlcData(data) {
  return data.map(([x, o, h, l, c]) => ({ x, o, h, l, c }));
}

async function fetchMarketChartData(id, currency) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return transformMarketCharData(data.prices);
}

function transformMarketCharData(data) {
  return data.map(([x, y]) => ({ x, y }));
}

function formatPrice(value) {
  const formatted = value.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const currency = $("#currencySelect").val();
  if (currency === "eur") {
    return `${formatted}€`;
  } else if (currency === "usd") {
    return `$${formatted}`;
  } else {
    return formatted;
  }
}

function showRequestLimitAlert() {
  const existingAlert = document.getElementById("alert");

  if (existingAlert) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    $("main").prepend(`
      <div class="row">
        <div id="alert" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <strong>Oops!</strong> We have reached a request limit. Try again later!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
    `);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
