from flask import *
import os
import requests
from flask import jsonify
import uuid
import random
from api.api_restaurant import *
from api.api_user import *
from api.api_google_comment import *
from api.api_favorite import *
from api.api_messages import *
from api.api_member import *
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('GOOGLE_MAPS_API_KEY')


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.register_blueprint(route_api_restaurant)
app.register_blueprint(route_api_user)
app.register_blueprint(route_api_google_comment)
app.register_blueprint(route_api_favorite)
app.register_blueprint(route_api_messages)
app.register_blueprint(route_api_member)


@app.route("/")
def index():
	return render_template("index.html")

@app.route("/city/<county>")
def city(county):
	return render_template("city.html")

@app.route("/member")
def member():
    return render_template("member.html")
@app.route("/restaurant/<id>")
def restaurant(id):
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    return render_template("restaurant.html", api_key=api_key)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)