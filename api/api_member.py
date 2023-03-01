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

print(connection_pool,"member")
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
        # print(img,"img")
        # print(key,"key")
        # print(test,"test")
        
        s3.Bucket('memberphoto').put_object(Key=img.filename, Body=img, ContentType='image/jpeg')
        url="https://dk7141qqdhlvd.cloudfront.net/"+ key
        # print(url,"上傳後照片網址")
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
        # print(key )

        try:
            obj=s3.Object(bucket_name="memberphoto", key=key)
            # print(obj,"obj")
            response = obj.get()
            # print(response,"obj_get")
            url="https://dk7141qqdhlvd.cloudfront.net/"+ key
            # print(url,"url")
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
     # 一定要先登入,先檢查是否有登入
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        # 從前端接收資料
        #前端接收資料
        data=request.json
        name=request.json["name"]
        contact_email=request.json["contact_email"]
        phone=request.json["phone"]
        birthday=request.json["birthday"]
        gender=request.json["gender"]
        # print(data)
        # print(name)
        # print(email)
        # print(phone)
        # print(birthday)
        # print(emergencyName)
        # print(emergencyPhone)
        # print(gender)
        
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
        # print(data)
        return json_result,403
# 打開會員頁面時,顯示已經填入的訊息
@route_api_member.route("/api/member",methods=["GET"])
def getMember():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        # 從前端接收資料
        
        
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor(dictionary=True)
            mycursor.execute("SELECT * FROM member WHERE member_id=%s",(member_id,))
            result = mycursor.fetchall()
            print(result)
            name=result[0]["name"]
            contact_email=result[0]["email"]
            member_phone=result[0]["member_phone"]
            birthday=result[0]["birthday"]
            gender=result[0]["gender"]
            data={
                "name":name,
                "contact_email":contact_email,
                "member_phone":member_phone,
                "birthday":str(birthday),
                "gender":gender
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