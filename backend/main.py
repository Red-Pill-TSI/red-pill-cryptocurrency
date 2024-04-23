from fastapi import FastAPI, Request, status, Response, Cookie, Form
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles

from contextlib import asynccontextmanager

from motor.motor_asyncio import AsyncIOMotorClient

from config import MONGO_DB


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
    response = PlainTextResponse('Hello here!')
    return response