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



app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.register_blueprint(route_api_restaurant)
app.register_blueprint(route_api_user)
app.register_blueprint(route_api_google_comment)
app.register_blueprint(route_api_favorite)


@app.route("/")
def index():
	return render_template("index.html")

@app.route("/member")
def member():
    return render_template("member.html")
@app.route("/restaurant/<id>")
def restaurant(id):
    return render_template("restaurant.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)