import uvicorn
from fastapi import FastAPI, Request, status, Response, Cookie, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient

import requests
from uuid import uuid4
from datetime import datetime, timezone

from config import MONGO_DB, POST_EMAIL_PASSWORD
from models import User
from services import send_emails, create_newsletter_html, get_cryptocurrency_data


DATABASE_NAME = 'red_pill'

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    app.mongodb_client = AsyncIOMotorClient(MONGO_DB)
    app.mongodb = app.mongodb_client[DATABASE_NAME]
    yield
    # Disconnect from MongoDB
    app.mongodb_client.close()


app = FastAPI(lifespan=lifespan)
app.mount('/static', StaticFiles(directory='static'), name='static')


@app.get('/', response_class=JSONResponse)
async def root(request: Request):
    response = PlainTextResponse('Hello there!')
    return response

@app.post('/subscription', response_class=JSONResponse)
async def subscription(request: Request):
    json = await request.json()
    user_email = json.get('userEmail')
    is_subscribed = json.get('isSubscribed')
    # Check if user_email is already in the database and update the subscription status
    user = await app.mongodb.users.find_one({'email': user_email})
    if user and is_subscribed is not None:
        await app.mongodb.users.update_one({'email': user_email}, {'$set': {'is_subscribed': is_subscribed}})
        return JSONResponse(content=dict(is_new_user=False, user_id=user['user_id'], subscription_status=is_subscribed), status_code=200)
    # If user_email is not in the database, create a new user and set the subscription status
    user = None
    if user_email:
        user = User(
            user_id=str(uuid4()),
            email=user_email,
            is_subscribed=is_subscribed,
            added_at=datetime.now(timezone.utc)
        ).model_dump()
        await app.mongodb.users.insert_one(user)
        return JSONResponse(content=dict(is_new_user=True, user_id=user['user_id'] if user and user.get('user_id') else None, subscription_status=is_subscribed), status_code=200)
    return JSONResponse(content=dict(user_id=None), status_code=400)

@app.post('/emails-newsletter', response_class=JSONResponse)
async def emails_newsletter(request: Request):
    json = await request.json()
    send_password = json.get('sendPassword')
    # Check if request is authorized
    if send_password != POST_EMAIL_PASSWORD:
        return JSONResponse(content=dict(message='Invalid password'), status_code=401)
    # Get all users that are subscribed
    users = await app.mongodb.users.find({'is_subscribed': True}).to_list(None)
    # Get cryptocurrency data
    crypto_data = await get_cryptocurrency_data()
    if not crypto_data:
        return JSONResponse(content=dict(message='Failed to get cryptocurrency data'), status_code=500)
    # Create email content
    html = create_newsletter_html(crypto_data)
    # Send emails to all subscribed users
    await send_emails(subject='Cryptocurrency Prices', to_emails=[user['email'] for user in users], html=html)
    return JSONResponse(content=dict(message='Emails newsletter sent'), status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
