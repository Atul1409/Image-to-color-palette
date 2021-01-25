from flask import Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = '7w6ei7f87gp0798tg'
from app import routes
