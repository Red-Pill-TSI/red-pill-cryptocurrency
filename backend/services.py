from smtplib import SMTP, SMTPException
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from datetime import datetime
from colorama import Fore
import requests

from config import GMAIL_EMAIL, GMAIL_PASSWORD, COINGECKO_API_KEY_1, COINGECKO_API_KEY_2

HOST = 'smtp.gmail.com'
PORT = 587


async def send_emails(subject: str, to_emails: list, html: str | None = None, message: str | None = None):
    # Login to the server email
    try:
        smtp = SMTP(HOST, PORT)
        smtp.ehlo()
        smtp.starttls()
        smtp.login(GMAIL_EMAIL, GMAIL_PASSWORD)
    except SMTPException as e:
        return
    # Send email to each email in the list
    for to_email in to_emails:
        try:
            msg = MIMEMultipart()
            msg['From'] = GMAIL_EMAIL
            msg['To'] = to_email
            msg['Subject'] = subject
            if html:
                msg.attach(MIMEText(html, 'html'))
            else:
                msg.attach(MIMEText(message, 'plain'))
            smtp.sendmail(GMAIL_EMAIL, to_email, msg.as_string())
            print(Fore.GREEN + f'[✔] Email sent to: {to_email}')
        except Exception as e:
            print(Fore.RED + f'[✖] Email not sent to: {to_email}. Error: {e}')
    smtp.quit()

def create_newsletter_html(crypto_data: list) -> str:
    # Create email content
    html = """
    <html>
    <head></head>
    <body>
    <h2>Dear our service User,</h2>
    <p>Here is the latest data on various cryptocurrencies:</p>
    <table border="1" cellpadding="5" cellspacing="0">
    <tr>
        <th></th>
        <th>Symbol</th>
        <th>Name</th>
        <th>Current Price</th>
        <th>Last Updated</th>
    </tr>
    """
    for item in crypto_data:
        html += f"""
        <tr>
        <td><img src="{item['image']}" width="50" height="50"></td>
        <td>{item['symbol']}</td>
        <td>{item['name']}</td>
        <td style="text-align: right">{item['current_price']} €</td>
        <td>{item['last_updated']}</td>
        </tr>
        """
    html += """
    </table>
    <br>
    <br>
    <p><i>Best regards,</i></p>
    <p><i>Red Pill CryptoCurrency team.</i></p>
    </body>
    </html>
    """
    return html

async def get_cryptocurrency_data():
    def get_response(api_key: str):
        url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur"
        headers = {
            "accept": "application/json",
            "x-cg-demo-api-key": api_key
        }
        response = requests.get(url, headers=headers)
        return response

    response = get_response(COINGECKO_API_KEY_1)
    # Check if the response is successful
    if response.status_code != 200:
        response = get_response(COINGECKO_API_KEY_2)
        if response.status_code != 200:
            print(Fore.RED + f'[✖] Failed to get data from Crypto Currency Monitoring Service')
            return None
    crypto_data = response.json()
    crypto_data = [
        dict(symbol=c.get('symbol'), 
             name=c.get('name'), 
             image=c.get('image'), 
             current_price=c.get('current_price'), 
             last_updated=c.get('last_updated')) for c in crypto_data
        ]
    # Sort crypto_data by current_price from highest to lowest
    crypto_data.sort(key=lambda x: x['current_price'], reverse=True)
    # Get the top 10 and bottom 10 cryptocurrencies
    crypto_data = crypto_data[:10] + crypto_data[-10:]
    # Last updated should be in such form '26 May 2021, 12:00'
    for item in crypto_data:
        item['last_updated'] = datetime.strptime(item['last_updated'], '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%d %b %Y, %H:%M')
    return crypto_data

