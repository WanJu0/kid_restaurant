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
from api.connector import connection_pool

mysql_username = os.getenv("MYSQL_USERNAME")
mysql_password = os.getenv("MYSQL_PASSWORD")
mysql_host = os.getenv("MYSQL_HOST")
mysql_database = os.getenv("MYSQL_DATABASE")



print(connection_pool,"user")
route_api_user = Blueprint("route_api_user", __name__, template_folder="templates")


@route_api_user.route("/api/user",methods=["POST"])
def signup():
    name=request.json["name"]
    email=request.json["email"]
    password=request.json["password"]
    if name=="" or email=="" or password=="":
        data={
            "error":True,
            "message":"請輸入帳號密碼"
        }
        json_result=jsonify(data)
        return json_result,400
   
    try:
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        mycursor.execute('SELECT * FROM member WHERE name=%s or email =%s ' ,(name, email))
        result = mycursor.fetchone()

        if result != None:
            data={
                "error":True,
                "message":"帳號已經存在"
            }
            json_result=jsonify(data)
            return json_result,400
        else:
            mycursor.execute("INSERT INTO member (name, email, password ) VALUES (%s, %s, %s)" ,(name,email,password))
            connection_object.commit()
            print(mycursor.rowcount, "record inserted.")
            mycursor.execute('SELECT * FROM member WHERE email=%s AND password =%s' ,(email, password))
            result = mycursor.fetchone()
            if result==None:
                data={
                    "error":True,
                    "message":"帳號密碼有誤"
                }
                json_result=jsonify(data)
                return json_result,400
            else:
                encoded_jwt = jwt.encode({
                    "id":result[0],
                    "name":result[1],
                    "email":result[2],
                    },"secretJWT", algorithm='HS256')
                data={
                    "ok":True,
                }
                response = make_response(jsonify(data))
                response.set_cookie(key="Set-Cookie", value=encoded_jwt, max_age=604800)
                json_result=jsonify(data)
                return response,200
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

@route_api_user.route("/api/user/auth",methods=["PUT"])
def signin():   
    
    email=request.json["email"]
    password=request.json["password"]
    if email=="" or password=="":
        data={
            "error":True,
            "message":"請輸入帳號密碼"
        }
        json_result=jsonify(data)
        return json_result,400
   
    try:
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        mycursor.execute('SELECT * FROM member WHERE email=%s AND password =%s' ,(email, password))
        result = mycursor.fetchone()
        if result==None:
            data={
                "error":True,
                "message":"帳號密碼有誤"
            }
            json_result=jsonify(data)
            return json_result,400
        else:

            encoded_jwt = jwt.encode({
                "id":result[0],
                "name":result[1],
                "email":result[2],
                },"secretJWT", algorithm='HS256')
            data={
                "ok":True,
            }
            
            response = make_response(jsonify(data))
            response.set_cookie(key="Set-Cookie", value=encoded_jwt, max_age=604800)
            json_result=jsonify(data)
            return response,200
        
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
    

@route_api_user.route("/api/user/auth",methods=["GET"])
def signin_get():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        data={
            "data":decode
        }
        json_result=jsonify(data)
        return json_result
    else:
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