from flask import *
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv
import json
import requests
from flask import jsonify
import os
load_dotenv()
import boto3 
import uuid
import jwt

mysql_username = os.getenv("MYSQL_USERNAME")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_host = os.getenv("MYSQL_HOST")
mysql_database = os.getenv("MYSQL_DATABASE")

aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key=os.getenv("AWS_SECRECT_ACCESS_KEY")
s3 = boto3.resource('s3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name="ap-northeast-1")

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    host=mysql_host,
    user=mysql_username,
    password=mysql_password ,
    database=mysql_database,
    pool_name = "kid_pool",
    pool_size = 5,
    pool_reset_session = True,
)

route_api_messages = Blueprint("route_api_messages", __name__, template_folder="templates")
@route_api_messages.route("/api/messages",methods=["POST"])
def updateMessage():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        # 從前端接收資料
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        img=request.files["img"]
        data=request.form
        content = data["content"]
        restaurant_id = data["restaurant_id"]
        print(img)
        print(data)
        print(content)
        print(restaurant_id )

        img_filename = str(uuid.uuid4()) + ".jpeg"
        s3.Bucket('restaurantmessages').put_object(Key=img_filename, Body=img)
        url="https://d15kspz08wzedg.cloudfront.net/"+ img_filename

        # return "1111"
        connection_object = connection_pool.get_connection()
        mycursor=connection_object.cursor()
        try:
            mycursor.execute("INSERT INTO messages (user_id, store_id, message_content, message_photo ) VALUES (%s, %s, %s, %s)" ,(member_id, restaurant_id, content,url))
            connection_object.commit()
            
            mycursor.close()
            connection_object.close()
            data={
                "content":content,
                "photo":url,
                "restaurant_id":restaurant_id
            }
            json_result=jsonify(data)
            return make_response(json_result,200) 
        except Exception as e:
            # print(e)
            data={
                "error": True,
                "message":e
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,500
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data)
        return json_result,403