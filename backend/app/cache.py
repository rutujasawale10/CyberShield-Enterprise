import time
import json
import functools
from typing import Any, Optional
from app.config import REDIS_URL

class InMemoryCache:
    """Fallback in-memory caching mechanism when Redis is offline."""
    def __init__(self):
        self._store = {}

    def get(self, key: str) -> Optional[str]:
        if key in self._store:
            val, expire_at = self._store[key]
            if expire_at is None or time.time() < expire_at:
                return val
            else:
                del self._store[key]
        return None

    def set(self, key: str, value: str, ex: Optional[int] = None):
        expire_at = time.time() + ex if ex else None
        self._store[key] = (value, expire_at)

    def delete(self, key: str):
        self._store.pop(key, None)

class CacheManager:
    _instance = None
    _redis_client = None

    @classmethod
    def get_client(cls):
        if cls._instance is None:
            if REDIS_URL:
                try:
                    import redis
                    r = redis.Redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=2)
                    r.ping()
                    cls._redis_client = r
                    print("[OK] Connected to Redis cache cluster.")
                except Exception:
                    print("[INFO] Redis server unavailable. Activated high-performance In-Memory Cache fallback.")
                    cls._redis_client = InMemoryCache()
            else:
                cls._redis_client = InMemoryCache()
            cls._instance = cls._redis_client
        return cls._instance

def cache_response(ttl_seconds: int = 300):
    """Decorator to cache API response outputs."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            cache = CacheManager.get_client()
            key_data = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            cached = cache.get(key_data)
            if cached:
                try:
                    return json.loads(cached)
                except Exception:
                    return cached
            result = func(*args, **kwargs)
            try:
                cache.set(key_data, json.dumps(result), ex=ttl_seconds)
            except Exception:
                pass
            return result
        return wrapper
    return decorator
