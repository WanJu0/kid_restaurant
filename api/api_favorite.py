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

route_api_favorite = Blueprint("route_api_favorite", __name__, template_folder="templates")

@route_api_favorite.route("/api/favorites",methods=["POST"])
def apiFavorite():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        # 從前端接收資料
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        store_id=request.json["restaurant_id"]
        print(member_id)
        print(store_id)
        
        # 和資料庫做互動
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        # 這邊要把資料放進去資料庫,並回傳狀態
        try:
            mycursor.execute("INSERT INTO favorite (user_id, store_id) VALUES (%s, %s)" ,(member_id,store_id))
            connection_object.commit()
            print(mycursor.rowcount, "record inserted.")
            data={
                "ok":True,
            }
           
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result, 200
        except:
            data={
                "error": True,
                "message":"伺服器錯誤"
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

@route_api_favorite.route("/api/favorites/<restaurantID>",methods=["GET"])
def getFavorite(restaurantID):
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        # 從前端接收資料
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
    # 和資料庫做互動
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        # 這邊要把資料放進去資料庫,並回傳狀態
        try:

            mycursor.execute('SELECT * FROM favorite WHERE user_id=%s and store_id =%s ' ,(member_id, restaurantID))
            result = mycursor.fetchone()
            if result != None:

                data={
                    "love":True,
                }
            
                json_result=jsonify(data)
                mycursor.close()
                connection_object.close()
                return json_result, 200
            else:
                data={
                    "love":False,
                }
            
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
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data)
        return json_result,403

# 這個是抓取使用者的所有儲存餐廳
@route_api_favorite.route("/api/favorites",methods=["GET"])
def getallFavorite():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        # 從前端接收資料
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
    # 和資料庫做互動
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor(dictionary=True)
        # 這邊要把資料放進去資料庫,並回傳狀態
        try:
            mycursor.execute('SELECT favorite.user_id, favorite.store_id, restaurant.place_id,restaurant.store_name, restaurant.address, restaurant.county, restaurant.district , restaurant.phone FROM favorite JOIN restaurant ON favorite.store_id = restaurant.id WHERE favorite.user_id=%s ' ,(member_id, ))
            result = mycursor.fetchall()
            print(result,"所有愛心")
            if result != [] :
                data_value=[]
                for i in range(0,len(result)):
                    favorite_restaurant_id=result[i]["store_id"]
                    store_name=result[i]["store_name"]
                    address=result[i]["address"]
                    county=result[i]["county"]
                    district=result[i]["district"]
                    place_id=result[i]["place_id"]
                    phone=result[i]["phone"]
                    

                    #  # 圖片處理
                    mycursor.execute("SELECT group_concat(photo) FROM restaurant INNER JOIN restaurant_photo ON restaurant.place_id=restaurant_photo.place_id WHERE restaurant.place_id=%s group by restaurant_photo.place_id" ,(place_id,))
                    photo = mycursor.fetchone()
                    # photo['photo']
                    photo_str = photo['group_concat(photo)']
                    photo_list = photo_str.split(',')
                    favorite_list={
                        "favorite_restaurant_id":favorite_restaurant_id,
                        "store_name":store_name,
                        "place_id":place_id,
                        "address":address,
                        "county":county,
                        "district":district,
                        "phone":phone,
                        "image":photo_list
                    }
                    data_value.append(favorite_list)	
                    
                data={

                    "data":data_value
                }
                json_result=jsonify(data)
                mycursor.close()
                connection_object.close()
                return json_result,200
            else:
                data={
                    "data":None
                }
                json_result=jsonify(data)
                mycursor.close()
                connection_object.close()
                return json_result,200


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
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data)
        return json_result,403

@route_api_favorite.route("/api/favorites",methods=["DELETE"])
def deleteFavorite():
    cookie=request.cookies.get("Set-Cookie")
    if cookie != None:
        # 從前端接收資料
        decode= jwt.decode(cookie, "secretJWT", ['HS256'])
        member_id=decode["id"]
        member_name=decode["name"]
        store_id=request.json["restaurant_id"]
        print(store_id)
    # 和資料庫做互動
        connection_object = connection_pool.get_connection()
        mycursor = connection_object.cursor()
        # 這邊要把收藏的資料刪除
        try:
            mycursor.execute("DELETE FROM favorite WHERE user_id=%s and store_id =%s " ,(member_id,store_id))
            connection_object.commit()
            print(mycursor.rowcount, "record inserted.")
            
            data={
                "love":False,
            }
            
            json_result=jsonify(data) 
            mycursor.close()
            connection_object.close()
            return make_response(json_result,200) 
           

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
    else:
        data={
                "error":True,
                "message":"請先登入會員"
            }
        # print(data)
        json_result=jsonify(data)
        return json_result,403
