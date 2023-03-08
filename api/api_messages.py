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



route_api_messages = Blueprint("route_api_messages", __name__, template_folder="templates")

@route_api_messages.route("/api/messages",methods=["POST"])
def createMessage():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode = jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id = decode["id"]
        member_name = decode["name"]
        img = request.files.get("img")
        
        data = request.form
        content = data["content"]
        restaurant_id = data["restaurant_id"]

        if img:
            img_filename = str(uuid.uuid4()) + ".jpeg"
            s3.Bucket('restaurantmessages').put_object(Key=img_filename, Body=img, ContentType='image/jpeg')
            url = "https://d3eag54e4l4ans.cloudfront.net/" + img_filename
        else:
            url = None

        
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor()
            mycursor.execute("INSERT INTO messages (user_id, store_id, message_content, message_photo ) VALUES (%s, %s, %s, %s)", (member_id, restaurant_id, content, url))
            connection_object.commit()
            data = {
                "content": content,
                "photo": url,
                "restaurant_id": restaurant_id
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
        data = {
            "error": True,
            "message": "請先登入會員"
        }
        json_result = jsonify(data)
        return json_result, 403


@route_api_messages.route("/api/messages/<memberID>",methods=["GET"])
def getmember_Message(memberID):
   
    try:
        connection_object = connection_pool.get_connection()
        mycursor=connection_object.cursor(dictionary=True)
        mycursor.execute("SELECT * FROM messages JOIN restaurant on messages.store_id=restaurant.id WHERE messages.user_id=%s",(memberID,))
        result = mycursor.fetchall()
       
        if result != None:
            data_value=[]
            for i in range(0,len(result)):
                messages_id=result[i]["messages_id"]
                user_id=result[i]["user_id"]
                store_id=result[i]["store_id"]
                message_content=result[i]["message_content"]
                message_photo=result[i]["message_photo"]
                date=str(result[i]["created_at"])
                store_name=result[i]["store_name"]
                
                mycursor.execute("SELECT * FROM member WHERE member_id=%s",(user_id,))
                photoresult = mycursor.fetchall() 

                user_photo=photoresult[0]["member_photo"]
                
                data={
                    "messages_id":messages_id,
                    "user_id":user_id,
                    "store_id":store_id,
                    "store_name":store_name,
                    "message_content":message_content,
                    "message_photo":message_photo,
                    "date":date,
                    "user_photo":user_photo
                }
                data_value.append(data)	
            data={
                "data":data_value,
            }
            json_result=jsonify(data)
            return make_response(json_result,200) 
       
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            return json_result,400
        
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


@route_api_messages.route("/api/messages/restaurant/<restaurantID>",methods=["GET"])
def getRestaurantMessage(restaurantID):
    
    try:
        connection_object = connection_pool.get_connection()
        mycursor=connection_object.cursor(dictionary=True)
        mycursor.execute("SELECT * FROM messages JOIN member on messages.user_id=member.member_id WHERE store_id=%s",(restaurantID,))
        
        result = mycursor.fetchall()

        if result != None:
            data_value=[]
            for i in range(0,len(result)):
                user_id=result[i]["user_id"]
                store_id=result[i]["store_id"]
                message_content=result[i]["message_content"]
                message_photo=result[i]["message_photo"]
                user_name=result[i]["name"]
                date=str(result[i]["created_at"])
                
                mycursor.execute("SELECT * FROM member WHERE member_id=%s",(user_id,))
                photoresult = mycursor.fetchall()
                user_photo=photoresult[0]["member_photo"]
            
                data={
                    "user_id":user_id,
                    "store_id":store_id,
                    "message_content":message_content,
                    "message_photo":message_photo,
                    "date":date,
                    "user_photo":user_photo,
                    "user_name":user_name
                }
                data_value.append(data)	
            data={
                "data":data_value,
            }
            json_result=jsonify(data)
            return make_response(json_result,200) 
       
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            return json_result,400
        
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

@route_api_messages.route("/api/update/messages",methods=["POST"])
def updateMessage():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        decode = jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id = decode["id"]
        member_name = decode["name"]
        img = request.files.get("img") 
        print(img,"更新的圖片")
        data = request.form
        content = data["content"]
        restaurant_id = data["restaurant_id"]
        messageId=data["messageId"]
    
        if img:
            img_filename = str(uuid.uuid4()) + ".jpeg"
            s3.Bucket('restaurantmessages').put_object(Key=img_filename, Body=img, ContentType='image/jpeg')
            url = "https://d3eag54e4l4ans.cloudfront.net/" + img_filename
        else:
            url = None

       
        try:
            connection_object = connection_pool.get_connection()
            mycursor = connection_object.cursor()
            mycursor.execute("UPDATE messages SET message_content=%s ,message_photo=%s WHERE messages_id=%s" ,(content, url, messageId))
            connection_object.commit()
            data = {
                "content": content,
                "photo": url,
                "messageId": messageId
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
        data = {
            "error": True,
            "message": "請先登入會員"
        }
        json_result = jsonify(data)
        return json_result, 403

@route_api_messages.route("/api/messages_id/<messageID>",methods=["GET"])
def getMessage_id(messageID):
   
    try:
        connection_object = connection_pool.get_connection()
        mycursor=connection_object.cursor(dictionary=True)
        mycursor.execute("SELECT * FROM messages JOIN restaurant on messages.store_id=restaurant.id WHERE messages_id=%s",(messageID,))
        result = mycursor.fetchall()
        
        if result != None:
            data_value=[]
            for i in range(0,len(result)):
                messages_id=result[i]["messages_id"]
                user_id=result[i]["user_id"]
                store_id=result[i]["store_id"]
                message_content=result[i]["message_content"]
                message_photo=result[i]["message_photo"]
                date=str(result[i]["created_at"])
                store_name=result[i]["store_name"]
                
                mycursor.execute("SELECT * FROM member WHERE member_id=%s",(user_id,))
                photoresult = mycursor.fetchall()
                print(photoresult,"photoresult")

                user_photo=photoresult[0]["member_photo"]
                
                data={
                    "messages_id":messages_id,
                    "user_id":user_id,
                    "store_id":store_id,
                    "store_name":store_name,
                    "message_content":message_content,
                    "message_photo":message_photo,
                    "date":date,
                    "user_photo":user_photo
                }
                data_value.append(data)	
            data={
                "data":data_value,
            }
            json_result=jsonify(data)
          
            return make_response(json_result,200) 
       
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            return json_result,400
        
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

@route_api_messages.route("/api/messages",methods=["DELETE"])
def deleteMessage():
    messageID=request.json["messageId"]
    cookie=request.cookies.get("Set-Cookie")
    print(messageID,"messageID")

    if cookie != None:
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
    
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        mycursor.execute("DELETE FROM messages WHERE messages_id=%s",(messageID,))
        connection_object.commit()
        print(mycursor.rowcount, "record inserted.")
        if mycursor.rowcount !=0:
            data={
                "ok":True,
            }
            json_result=jsonify(data) 
            mycursor.close()
            connection_object.close()
            return make_response(json_result,200)  
        else:
            data={
                "error":True,
                "message":"刪除失敗"
            }

            json_result=jsonify(data) 
            mycursor.close()
            connection_object.close()
            return make_response(json_result,403)  
       
       
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        json_result=jsonify(data) 
        return make_response(json_result,403)  