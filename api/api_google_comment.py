from flask import *
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv
import json
import requests
from flask import jsonify
import os
load_dotenv()
import requests
from api.connector import connection_pool

mysql_username = os.getenv("MYSQL_USERNAME")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_host = os.getenv("MYSQL_HOST")
mysql_database = os.getenv("MYSQL_DATABASE")


print(connection_pool,"google_comment")
route_api_google_comment = Blueprint("route_api_google_comment", __name__, template_folder="templates")

@route_api_google_comment.route("/api/google_comment/<placeID>",methods=["GET"])
def google_comment(placeID):
   
    try:
        connection_object = connection_pool.get_connection()
        mycursor=connection_object.cursor(dictionary=True)
        mycursor.execute("SELECT * FROM google_comment WHERE place_id=%s",(placeID,))
        result = mycursor.fetchall()
        # print(result)
        # print(len(result))
        data_value=[]
        for i in range(0,len(result)):
            author_name=result[i]["author_name"]
            profile_photo_url=result[i]["profile_photo_url"]
            relative_time_description=result[i]["relative_time_description"]
            text=result[i]["text"]
            rating=result[i]["rating"]
            comment_list={
                "author_name":author_name ,
                "profile_photo_url":profile_photo_url,
                "relative_time_description":relative_time_description,
                "text":text,
                "rating":rating
            }
            data_value.append(comment_list)
       
        data={
            "data":data_value,
        }
        json_result=jsonify(data)
        return json_result,200
    except:
        data={
            "error": True,
            "message":"伺服器錯誤"
        }
        json_result=jsonify(data)
        return json_result,500
    finally:
        mycursor.close()
        connection_object.close()