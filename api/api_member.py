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
import base64

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

route_api_member = Blueprint("route_api_member", __name__, template_folder="templates")

# 
@route_api_member.route("/api/member/photo",methods=["POST"])
def memberPhoto():
    # 一定要先登入,先檢查是否有登入
    cookie=request.cookies.get("Set-Cookie")
    # print(cookie)
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        memberId=decode["id"]
        member_name=decode["name"]
        member_email=decode["email"]
        test=request.files
        img=request.files["img"]
        key=img.filename
        print(img,"img")
        print(key,"key")
        print(test,"test")
        
        s3.Bucket('memberphoto').put_object(Key=img.filename, Body=img, ContentType='image/jpeg')
        url="https://dk7141qqdhlvd.cloudfront.net/"+ key
        print(url,"上傳後照片網址")
        data={
            "image":url,
        }
        json_result=jsonify(data) 
        return make_response(json_result,200)  
        # return "上傳成功"  
       
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data) 
        return make_response(json_result,403)  

@route_api_member.route("/api/member/photo",methods=["GET"])
def checkImg():
    # 一定要先登入,先檢查是否有登入
    cookie=request.cookies.get("Set-Cookie")
    # print(cookie)
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        memberId=decode["id"]
        member_name=decode["name"]
        member_email=decode["email"]
        key =str(memberId) + ".jpg"
        print(key )

        try:
            obj=s3.Object(bucket_name="memberphoto", key=key)
            print(obj,"obj")
            response = obj.get()
            print(response,"obj_get")
            url="https://dk7141qqdhlvd.cloudfront.net/"+ key
            print(url,"url")
            # image_data = response['Body'].read()
            # base64_data = base64.b64encode(image_data).decode()
            # base64_data = "data:image/jpeg;base64," + base64_data
            data={
                "image":url,
            }
            json_result=jsonify(data) 
            return make_response(json_result,200)  
            
            # return make_response(base64_data,200)  
            # return "1111"
        except Exception as e:
            # print(f'圖片 {key} 不存在')
            # print(e)
            data={
                "image":None,
            }
            json_result=jsonify(data)
            return make_response(json_result,200)  
            # return "False" 
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data) 
        return make_response(json_result,403)  