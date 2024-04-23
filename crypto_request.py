import sys
import requests

def request_currency_info(args):

    if args[1] == None:
        return 1

    headers = {
        "accept": "application/json",
        "x-cg-demo-api-key": "CG-Nmck2eYFfJEfpso69m3uePgY"
    }

    if args[1].lower() == "markets":

        currencies = ["usd", "eur"]
        if not args[2].lower() in currencies:
            return 1

        url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=" + args[2].lower()
        response = requests.get(url, headers=headers)

        return response.json()

    if args[1].lower() == "ohlc":

        currencies = ["usd", "eur"]
        if args[2].lower() == None or not args[3].lower() in currencies:
            return 1

        url = "https://api.coingecko.com/api/v3/coins/" + args[2].lower() + "/ohlc?vs_currency=" + args[3].lower() + "&days=1"
        response = requests.get(url, headers=headers)

        return response.json()

if __name__ == "__main__":
    args = sys.argv[1:]
    print(request_currency_info(args))