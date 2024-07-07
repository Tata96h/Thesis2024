# middlewares.py

from fastapi import Request
from fastapi.responses import Response
from fastapi.middleware.base import BaseHTTPMiddleware # type: ignore


class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
