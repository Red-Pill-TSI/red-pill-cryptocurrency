<div align="center">
  <h1>Red Pill Cryptocurrency</h1>
  <img src="https://github.com/Red-Pill-TSI/red-pill-cryptocurrency/assets/37586652/0650a31b-a42e-4c35-8a91-e9a19d7c86af" width="256" alt="Logo">
  <div>Web application intended for monitoring cryptocurrency rates,</div>
  <div>created for a university project by a team of students.</div>
</div>

## Features

* Integration with the [CoinGecko API](https://www.coingecko.com/) to obtained cryptocurrency rates. 📈
* Beautiful financial charts implemented using [Chart.js](https://www.chartjs.org/). Oh, and they're in a carousel. 🚀
* A [DataTables](https://datatables.net/)-powered cryptocurrency table supporting filterting, sorting, pagination, and CSV export. 🔥
* Conversions of cryptocurrency prices to either EUR or USD, depending on your preferred choice. 💲
* Ability to subscribe to an email newsletter of the most trending cryptocurrency rates. 🤓

## Running Locally

To launch the project, you need to start the frontend and, optionally, the backend.

### Frontend

The simplest way to start the frontend is to open the [index.html](https://github.com/Red-Pill-TSI/red-pill-cryptocurrency/blob/main/frontend/static/index.html)
file directly in your web browser of choice. Alternatively, you may start an [Express](https://expressjs.com/) server by executing the following commands from the
`frontend` directory, assuming you have [Node.js](https://nodejs.org/en) and [npm](https://www.npmjs.com/) installed:

```sh
npm install
npm start
```

The website should be accessible at `http://localhost:3000/`.

### Backend

To run the backend, you need to have a local intallation of the Python interpreter. From the `backend` directory, you
must first ensure that you have all the necessary dependencies installed:

```sh
pip install -r requirements.txt
```

Now you may start up the backend server itself using the following command:

```sh
uvicorn main:app --host 127.0.0.1 --port 8000
```

The server should be accessible at `http://127.0.0.1:8000/`. For information about endpoints, refer to the [OpenAPI
specification](https://github.com/Red-Pill-TSI/red-pill-cryptocurrency/blob/main/docs/red-pill-cryptocurrency-1.0.0.yaml)
under `docs`.

## Contributions

This project was developed during a Web Application Development Tools course by the following group of students:

* Anton Dronov (Project Manager) - controlled the overall development process.
* Daniils Buts (Team Leader) - created carousel charts and the final cryptocurrency table.
* Daniils Grammatikopulo (Frontend Developer) - created application branding and the "About Us" page.
* Jūlija Belova (Frontend Developer) - integrated the subscription form with the backend.
* Maksims Pavlovskis (Frontend Developer) - created the application's main layout.
* Nikita Golovizņins (Business Analyst) - designed the cryptocurrency table; researched and setup the CoinGecko API. 
* Oļegs Ivanovs (Backend Developer) - created the server-side email newsletter functionality.

Thanks to everyone for participating!
