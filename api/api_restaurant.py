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

route_api_restaurant = Blueprint("route_api_restaurant", __name__, template_folder="templates")
@route_api_restaurant.route("/api/restaurant",methods=["GET"])
def api_restaurant():
    connection_object = connection_pool.get_connection()
    mycursor=connection_object.cursor(dictionary=True)
    page = int(request.args.get("page","0"))
    keyword = request.args.get("keyword","")
    try:
        if keyword == "":
            mycursor.execute("SELECT * FROM restaurant LIMIT %s ,%s",(page*12,12))
            result = mycursor.fetchall()
        
        else:
            # 模糊比對景點名稱或分類完全比對
            mycursor.execute("SELECT * FROM restaurant WHERE county=%s or district LIKE %s LIMIT %s ,%s",(keyword ,"%"+keyword+"%", page*12, 12))
            result = mycursor.fetchall()
            # print(result)
        if result != None:
            data_value=[]
            # print(result)
            for i in range(0,len(result)):
                id=result[i]["id"]
                place_id=result[i]["place_id"]
                store_name=result[i]["store_name"]
                address=result[i]["address"]
                location=result[i]["location"]
                county=result[i]["county"]
                district=result[i]["district"]
                lat=result[i]["lat"]
                lng=result[i]["lng"]
                phone=result[i]["phone"]
                rating=result[i]["rating"]

                #  # 圖片處理
                mycursor.execute("SELECT group_concat(photo) FROM restaurant INNER JOIN restaurant_photo ON restaurant.place_id=restaurant_photo.place_id WHERE restaurant.place_id=%s group by restaurant_photo.place_id" ,(place_id,))
                photo = mycursor.fetchone()
                # photo['photo']
                photo_str = photo['group_concat(photo)']
                photo_list = photo_str.split(',')
                # print( photo_list,"照片")
                # photo_str = photo[0].split(',')
                attraction_list={
                    "id":id ,
                    "place_id":place_id,
                    "store_name":store_name,
                    "address":address,
                    "location":location,
                    "county":county,
                    "district":district,
                    "lat":lat,
                    "lng":lng,
                    "phone":phone,
                    "rating":rating,
                    "image":photo_list
                }
                data_value.append(attraction_list)	
                if len(result)<12:
                    next_Page=None
                else:
                    next_Page=page+1
                
            if data_value==[]:
                data={

                "nextPage":None ,
                "data":data_value
                }
                json_result=jsonify(data)
                mycursor.close()
                connection_object.close()
                return json_result,200
            data={

                "nextPage": next_Page,
                "data":data_value
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,200
        # for i in range(0,len(result)):
        #     print()
    except Exception as e:
        data={
            "error": True,
            "message":e
        }
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return json_result,500

@route_api_restaurant.route("/api/restaurant/<restaurantID>",methods=["GET"])      
def restaurant_ID(restaurantID):
    # print(restaurantID)
    connection_object = connection_pool.get_connection()
    mycursor=connection_object.cursor(dictionary=True)
    try:
        mycursor.execute("SELECT * FROM restaurant WHERE id=%s",(restaurantID,))
        result = mycursor.fetchone()
        # print(result)
        # print(type(result))
        if result != None:
            id= result["id"]
            place_id=result["place_id"]
            store_name=result["store_name"]
            address=result["address"]
            location=result["location"]
            county=result["county"]
            district=result["district"]
            lat=result["lat"]
            lng=result["lng"]
            phone=result["phone"]
            rating=result["rating"]
            
            # 圖片處理
            mycursor.execute("SELECT GROUP_CONCAT(photo) FROM restaurant INNER JOIN restaurant_photo ON restaurant.place_id=restaurant_photo.place_id WHERE restaurant.place_id=%s GROUP BY restaurant_photo.place_id" ,(place_id,))
            photo = mycursor.fetchone()
            # print(photo)
            photo_str = photo['GROUP_CONCAT(photo)']
            photo_list = photo_str.split(',')
            # print(photo[0])
        #     photo_str = photo[0].split(',')
            # print(photo_list,"111")
            # 進入google api
            key = os.getenv("key")
            myheaders={
            "content-type":"application/json",
            }
            response=requests.get("https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&language=zh-TW&key="+key,headers=myheaders).json()
            # print(response,"google")
            opening_hours=response["result"]["current_opening_hours"]["open_now"]
            weekday_text=response["result"]["current_opening_hours"]["weekday_text"]
            # print(opening_hours)
            # print(weekday_text)
            attraction_list={
                "id":id ,
                "place_id":place_id,
                "store_name":store_name,
                "address":address,
                "location":location,
                "county":county,
                "district":district,
                "lat":lat,
                "lng":lng,
                "phone":phone,
                "rating":rating,
                "image":photo_list,
                "opening_hours":opening_hours,
                "weekday_text":weekday_text

            }
            
            data={
                "data":attraction_list
            }
			
            json_result=jsonify(data)
            # print(json_result)
            mycursor.close()
            connection_object.close()
            return json_result
        else:
            data={
            "error": True,
            "message":"編號不存在"
            }
            json_result=jsonify(data)
            mycursor.close()
            connection_object.close()
            return json_result,400
        # return "1111" 
    except Exception as e:
        print(e)
        data={
            "error": True,
            "message":e
        }
        json_result=jsonify(data)
        mycursor.close()
        connection_object.close()
        return json_result,500
# @route_api_restaurant.route("https://maps.googleapis.com/maps/api/place/details/json?place_id="+place_id+"&language=zh-TW&key="+key)