from flask import *
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
from dotenv import load_dotenv
import json
import requests
from flask import jsonify
import os
load_dotenv()
import jwt

mysql_username = os.getenv("MYSQL_USERNAME")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_host = os.getenv("MYSQL_HOST")
mysql_database = os.getenv("MYSQL_DATABASE")


connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    host=mysql_host,
    user=mysql_username,
    password=mysql_password ,
    database=mysql_database,
    pool_name = "kid_pool",
    pool_size = 5,
    pool_reset_session = True,
)

route_api_user = Blueprint("route_api_user", __name__, template_folder="templates")


@route_api_user.route("/api/user",methods=["POST"])
def signup():
    # 從前端接收資料
    name=request.json["name"]
    email=request.json["email"]
    password=request.json["password"]
    #註冊帳號密碼不能為空
    if name=="" or email=="" or password=="":
        data={
            "error":True,
            "message":"請輸入帳號密碼"
        }
        json_result=jsonify(data)
        return json_result,400
    
    # 和資料庫做互動
    connection_object = connection_pool.get_connection()
    mycursor = connection_object.cursor()
    try:
        # 檢查姓名 帳號是否存在
        mycursor.execute('SELECT * FROM member WHERE name=%s or email =%s ' ,(name, email))
        result = mycursor.fetchone()
        # print(result)
        if result != None:
            data={
                "error":True,
                "message":"帳號已經存在"
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,400
        # 把資料放進資料庫 完成註冊
        mycursor.execute("INSERT INTO member (name, email, password ) VALUES (%s, %s, %s)" ,(name,email,password))
        connection_object.commit()
        print(mycursor.rowcount, "record inserted.")
        data={
            "ok":True,
        }
        # print(data)
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return json_result, 200
    except Exception as e:
        print(e)
        data={
            "error": True,
            "message":"伺服器錯誤"
        }
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return json_result,500

# 登入系統！
@route_api_user.route("/api/user/auth",methods=["PUT"])
def signin():   
    email=request.json["email"]
    password=request.json["password"]
    #登入帳號密碼不能為空
    if email=="" or password=="":
        data={
            "error":True,
            "message":"請輸入帳號密碼"
        }
        # print(data)
        json_result=jsonify(data)
        return json_result,400
    # 和資料庫做互動
    connection_object = connection_pool.get_connection()
    mycursor = connection_object.cursor()
    try:
        # 檢查帳號密碼是否正確
        mycursor.execute('SELECT * FROM member WHERE email=%s AND password =%s' ,(email, password))
        result = mycursor.fetchone()
        # print(result)
        if result==None:
            mycursor.close()
            connection_object.close()
            data={
                "error":True,
                "message":"帳號密碼有誤"
            }
            # print(data)
            json_result=jsonify(data)
            return json_result,400
        # 用jwt產生token
        
        encoded_jwt = jwt.encode({
            "id":result[0],
            "name":result[1],
            "email":result[2],
            # "exp": datetime.utcnow() + timedelta(minutes=1)
            },"secretJWT", algorithm='HS256')
        # print(encoded_jwt)
        data={
            "ok":True,
        }
        
        response = make_response(jsonify(data))
        response.set_cookie(key="Set-Cookie", value=encoded_jwt, max_age=604800)
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return response,200
        
    except Exception as e:
        print(e)
        data={
            "error": True,
            "message":"伺服器錯誤"
        }
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return json_result,500

@route_api_user.route("/api/user/auth",methods=["GET"])
def signin_get():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        # print(decode)
        data={
            "data":decode
        }
        json_result=jsonify(data)
        return json_result
    data={
            "data":False
    }
    json_result=jsonify(data)
    return json_result

@route_api_user.route("/api/user/auth",methods=["DELETE"])
def signout():  
    data={
        "ok":True
    }
    response = make_response(jsonify(data))
    response.set_cookie(key="Set-Cookie", value="", max_age=-1)

    return response,200