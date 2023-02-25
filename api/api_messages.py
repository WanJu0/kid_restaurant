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
        
        img_filename = str(uuid.uuid4()) + ".jpeg"
        s3.Bucket('restaurantmessages').put_object(Key=img_filename, Body=img, ContentType='image/jpeg')
        url="https://d3eag54e4l4ans.cloudfront.net/"+ img_filename

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

# 在member頁面顯示會員的所有評論
@route_api_messages.route("/api/messages/<memberID>",methods=["GET"])
def getmember_Message(memberID):
    connection_object = connection_pool.get_connection()
    mycursor=connection_object.cursor(dictionary=True)
    try:
        mycursor.execute("SELECT * FROM messages JOIN restaurant on messages.store_id=restaurant.id WHERE messages.user_id=%s",(memberID,))
        result = mycursor.fetchall()
        # print(result,"所有評論")
       
        # # 這邊先將
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
                
                # 抓取留言者的大頭照
                key = f"{user_id}.jpg"
                # key =user_id +".jpg"
                print(key,"大頭照" )

                try:
                    obj=s3.Object(bucket_name="memberphoto", key=key)
                    # print(obj,"obj")
                    response = obj.get()
                    # print(response,"obj_get")
                    url="https://dk7141qqdhlvd.cloudfront.net/"+ key
                    
                    
                    user_photo={
                        "image":url,
                    }
                except Exception as e:
                    # print(f'圖片 {key} 不存在')
                    # print(e)
                    user_photo={
                        "image":None,
                    }

                
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
            # print(json_result)
            mycursor.close()
            connection_object.close()
            return make_response(json_result,200) 
       
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,400
        
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

# 在餐廳頁面抓取所有餐廳的評論
@route_api_messages.route("/api/messages/restaurant/<restaurantID>",methods=["GET"])
def getRestaurantMessage(restaurantID):
    connection_object = connection_pool.get_connection()
    mycursor=connection_object.cursor(dictionary=True)
    try:
        mycursor.execute("SELECT * FROM messages JOIN member on messages.user_id=member.member_id WHERE store_id=%s",(restaurantID,))
        result = mycursor.fetchall()
        print(result,"這邊")
        
        # # 這邊先將
        if result != None:
            data_value=[]
            for i in range(0,len(result)):
                user_id=result[i]["user_id"]
                store_id=result[i]["store_id"]
                message_content=result[i]["message_content"]
                message_photo=result[i]["message_photo"]
                user_name=result[i]["name"]
                date=str(result[i]["created_at"])
                
                # 抓取留言者的大頭照
                key = f"{user_id}.jpg"
                # key =user_id +".jpg"
                print(key,"大頭照" )

                try:
                    obj=s3.Object(bucket_name="memberphoto", key=key)
                    print(obj,"obj")
                    response = obj.get()
                    print(response,"obj_get")
                    url="https://dk7141qqdhlvd.cloudfront.net/"+ key
                    print(url,"url")
                    
                    user_photo={
                        "image":url,
                    }
                except Exception as e:
                    # print(f'圖片 {key} 不存在')
                    print(e)
                    user_photo={
                        "image":None,
                    }

                
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
            # print(json_result)
            mycursor.close()
            connection_object.close()
            return make_response(json_result,200) 
       
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,400
        
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
