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
from api.connector import connection_pool

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

route_api_member = Blueprint("route_api_member", __name__, template_folder="templates")

@route_api_member.route("/api/member/photo",methods=["POST"])
def memberPhoto():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        memberId=decode["id"]
        member_name=decode["name"]
        member_email=decode["email"]
        test=request.files
        img=request.files["img"]
        key=img.filename
       
        s3.Bucket('memberphoto').put_object(Key=img.filename, Body=img, ContentType='image/jpeg')
        url="https://dk7141qqdhlvd.cloudfront.net/"+ key
        
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor()
            mycursor.execute("UPDATE member SET member_photo=%s  WHERE member_id=%s" ,(url, memberId))
            connection_object.commit()
            data={
                "image":url,
            }
            json_result = jsonify(data)
            return make_response(json_result, 200) 
        except Exception as e:
            data = {
                "error": True,
                "message": e
            }
            json_result = jsonify(data)
            return json_result, 500
        finally:
            mycursor.close()
            connection_object.close()
       
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
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        memberId=decode["id"]
        member_name=decode["name"]
        member_email=decode["email"]
        key =str(memberId) + ".jpg"
       
        try:
            obj=s3.Object(bucket_name="memberphoto", key=key)
            response = obj.get()
            # print(response,"obj_get")
            url="https://dk7141qqdhlvd.cloudfront.net/"+ key
            data={
                "image":url,
            }
            json_result=jsonify(data) 
            return make_response(json_result,200)  
        except Exception as e:
            print(e)
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

# 會員頁面資料更新api
@route_api_member.route("/api/member",methods=["POST"])
def apiMembers():
    
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        
        data=request.json
        name=request.json["name"]
        contact_email=request.json["contact_email"]
        phone=request.json["phone"]
        birthday=request.json["birthday"]
        gender=request.json["gender"]
       
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor()
            mycursor.execute("UPDATE member SET name=%s, email=%s, member_phone=%s, birthday=%s,  gender=%s  WHERE member_id=%s" ,(name, contact_email, phone, birthday, gender, member_id))
            connection_object.commit()
            print(mycursor.rowcount, "record inserted.")
            return make_response("更新成功",200)
        except Exception as e:
            print(e)
            data={
                "error": True,
                "message":"伺服器錯誤"
            }
            json_result=jsonify(data)
            return json_result,500
        finally:
            mycursor.close()
            connection_object.close()
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        return json_result,403
# 打開會員頁面時,顯示已經填入的訊息
@route_api_member.route("/api/member",methods=["GET"])
def getMember():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
      
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor(dictionary=True)
            mycursor.execute("SELECT * FROM member WHERE member_id=%s",(member_id,))
            result = mycursor.fetchall()
           
            name=result[0]["name"]
            contact_email=result[0]["email"]
            member_phone=result[0]["member_phone"]
            birthday=result[0]["birthday"]
            gender=result[0]["gender"]
            member_photo=result[0]["member_photo"]

            data={
                "name":name,
                "contact_email":contact_email,
                "member_phone":member_phone,
                "birthday":str(birthday),
                "gender":gender,
                "member_photo":member_photo
            }
            json_result=jsonify(data)
            return make_response(json_result,200) 
        except Exception as e:
            print(e)
            data={
                "error": True,
                "message":"伺服器錯誤"
            }
            json_result=jsonify(data)
            return json_result,500
        finally:
            mycursor.close()
            connection_object.close()
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data)
        return json_result,403