import os
import psycopg2
from psycopg2 import pool
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

class Database:
    _connection_pool = None

    @classmethod
    def initialize(cls):
        if cls._connection_pool is None:
            try:
                cls._connection_pool = psycopg2.pool.ThreadedConnectionPool(
                    minconn=1,
                    maxconn=20,
                    host=os.getenv("DB_HOST"),
                    port=os.getenv("DB_PORT"),
                    user=os.getenv("DB_USER"),
                    password=os.getenv("DB_PASSWORD"),
                    dbname=os.getenv("DB_NAME")
                )
                print("Database connection pool created successfully.")
            except Exception as e:
                print(f"Error creating connection pool: {e}")
                raise e

    @classmethod
    @contextmanager
    def get_cursor(cls):
        if cls._connection_pool is None:
            cls.initialize()

        conn = cls._connection_pool.getconn()
        try:
            with conn.cursor() as cursor:
                yield cursor
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cls._connection_pool.putconn(conn)

    @classmethod
    def close(cls):
        if cls._connection_pool:
            cls._connection_pool.closeall()
            print("Database connection pool closed.")

db = Database
