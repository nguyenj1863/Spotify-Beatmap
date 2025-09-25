# server/run.py
from app import create_app
from dotenv import load_dotenv

load_dotenv()

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="127.20.10.3", port=5000)
