let nextPage = 0;
let isLoading = false;
let keyword = "";

let store_id_list=[];

// console.log(store_id_list,"list222")
function restaurant() {
    fetch(`/api/restaurant?page=${nextPage}`, {})
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            for (let i = 0; i < jsonData.data.length; i++) {
                let store_id= jsonData.data[i].id;
                let address = jsonData.data[i].address;
                let straddress = address.split('台灣');
                let content = document.querySelector("#content");
                store_id_list.push(store_id);
                
                //新增一個連結在最外層
                let restaurantLink = document.createElement("a");
                restaurantLink.className = `restaurant_link${i}`;
                restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                content.appendChild(restaurantLink);

                let restaurantDiv = document.createElement("div");
                restaurantDiv.className = `restaurant_information${i}`;
                restaurantLink.appendChild(restaurantDiv);

                // 建立圖片在 restaurantDiv 中
                let restaurant_content=document.querySelector(`.restaurant_information${i}`);
                let imgDiv = document.createElement("div")
                imgDiv.className = "imgDiv"
                let img=document.createElement("img");
                img.className="restaurant_image";
                img.src="https://"+jsonData.data[i].image[0];
                imgDiv.appendChild(img)
                restaurant_content.appendChild(imgDiv);
                
                // 建立圖片上的地標位置
                let prodcut_map = document.createElement("div")
                prodcut_map.className = `product_map${i}`;
                restaurant_content.appendChild(prodcut_map);
                let prodcut_map_content = document.querySelector(`.product_map${i}`)
                let mapImg=document.createElement("img");
                mapImg.className=" product_map_photo"
                mapImg.src="/static/image/22.png"
                mapImg.setAttribute("width", "24");
                mapImg.setAttribute("height", "24");
                prodcut_map_content.appendChild(mapImg);
                restaurant_content.appendChild(prodcut_map_content);

                let mapText=document.createElement("div")
                mapText.className="map_text"
                let mapTextNode = document.createTextNode(jsonData.data[i].county);
                mapText.appendChild(mapTextNode);
                prodcut_map_content.appendChild(mapText)

                // 在圖片中建立愛心
                let prodcut_love = document.createElement("button")
                prodcut_love.className = `product_love${i}`;
                prodcut_love.id="love"+store_id;
                prodcut_love.setAttribute("onclick","event.preventDefault(); homefavorite(this.id);" )
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i}`)
                let loveImg=document.createElement("img");
                loveImg.className=" product_love_photo"
                // loveImg.id="love"+store_id
                loveImg.src="/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);

                // 建立紅色愛心
                let prodcut_redlove = document.createElement("button")
                prodcut_redlove.className = `product_redlove${i}`;
                prodcut_redlove.id="redlove"+store_id;
                prodcut_redlove.setAttribute("onclick","event.preventDefault(); unhomefavorite(this.id);" )
                restaurant_content.appendChild(prodcut_redlove);
                let prodcut_redlove_content = document.querySelector(`.product_redlove${i}`)
                let redloveImg=document.createElement("img");
                redloveImg.className=" product_redlove_photo";
                // redloveImg.id="redlove"+store_id;
                redloveImg.src="/static/image/red_heart.png";
                redloveImg.setAttribute("width", "24");
                redloveImg.setAttribute("height", "24");
                prodcut_redlove_content.appendChild(redloveImg);
                restaurant_content.appendChild(prodcut_redlove_content);

                // 建立information
                let informationElement = document.createElement("div");
                informationElement.className = `information${i}`;
                restaurant_content.appendChild(informationElement);

                // information 底下建立name phone adress的div
                let informationDiv = document.querySelector(`.restaurant_information${i} .information${i}`);
                // 建立store name
                let storeName = document.createElement("div");
                storeName.className = "store_name";
                let storeNode = document.createTextNode(jsonData.data[i].store_name);
                storeName.appendChild(storeNode);
                informationElement.appendChild(storeName);
                // 建立 電話
                let phoneElement = document.createElement("div");
                phoneElement.className = "phone";
                let phoneNode = document.createTextNode(jsonData.data[i].phone);
                phoneElement.appendChild(phoneNode);
                informationElement.appendChild(phoneElement);
                // 建立 地址
                let addressElement = document.createElement("div");
                addressElement.className = "address";
                let addressNode = document.createTextNode(straddress[1]);
                addressElement.appendChild(addressNode);
                informationElement.appendChild(addressElement);

                if (i == jsonData.data.length - 1) {
                    isLoading = true;
                }
            }
            //  判斷是否有登入如果有登入就看看是否有喜愛的餐廳,而且是一開始仔入的這12個餐聽
        fetch("/api/user/auth", {
            method: "GET",
        })
        .then((response) => {
            // 這裡會得到一個 ReadableStream 的物件
            // 可以透過 blob(), json(), text() 轉成可用的資訊
            return response.json();
        }).then((jsonData) => {
            if (jsonData.data != false) {
                fetch("/api/favorites",{
                    method: "GET",
                })
                .then((response)=>{
                    return response.json();
                }).then((jsonData)=>{
                    if(jsonData.data !== null){
                        for(i=0;i<jsonData.data.length;i++){
                            // console.log(jsonData.data,"1")
                            let favorite_id=jsonData.data[i].favorite_restaurant_id
                            favorite_id=parseFloat(favorite_id)
                            if (store_id_list.includes(favorite_id)) {
                                const loveButton = document.querySelector(`#love${favorite_id}`);
                                // console.log(loveButton,"loveButton")
                                const redLoveButton = document.querySelector(`#redlove${favorite_id}`);
                                loveButton.style.display = "none";
                                redLoveButton.style.display = "block";
                                // console.log(store_id_list,"裏")
                            }
                        }
                       
                    }
                })
            }
            
        
            
        })

            if (isLoading == true) {
                observer.observe(cards);
            }

            nextPage = jsonData.nextPage;
        })
        

        

}

let options = {
    // rootMargin: '0px 0px 0px 0px',
    threshold: 1,
}
//選定要觀察的對象

//設定call back
const callback = (entries) => {
    if (nextPage == null) return;
    if (entries[0].isIntersecting) {
        if (nextPage !== null) {
            isLoading = true;
            fetch(`/api/restaurant?page=${nextPage}&keyword=${keyword}`, {})
                .then((response) => {
                    return response.json();
                }).then((jsonData) => {
            
                    for (let i = 0; i < jsonData.data.length; i++) {
                        let store_id= jsonData.data[i].id;
                        let address = jsonData.data[i].address;
                        let straddress = address.split('台灣');
                        let content = document.querySelector("#content");
                        //新增一個連結在最外層
                        let restaurantLink = document.createElement("a");
                        store_id_list.push(store_id);
                        restaurantLink.className = `restaurant_link${i+12*nextPage}`;
                        restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                        content.appendChild(restaurantLink);
            
                        let restaurantDiv = document.createElement("div");
                        restaurantDiv.className = `restaurant_information${i+12*nextPage}`;
                        restaurantLink.appendChild(restaurantDiv);

                        // 建立圖片在 restaurantDiv 中
                        let restaurant_content=document.querySelector(`.restaurant_information${i+12*nextPage}`);
                        let imgDiv = document.createElement("div")
                        imgDiv.className = "imgDiv"
                        let img=document.createElement("img");
                        img.className="restaurant_image";
                        img.src="https://"+jsonData.data[i].image[0];
                        imgDiv.appendChild(img)
                        restaurant_content.appendChild(imgDiv);

                        // 建立圖片上的地標位置
                        let prodcut_map = document.createElement("div")
                        prodcut_map.className = `product_map${i+12*nextPage}`;
                        restaurant_content.appendChild(prodcut_map);
                        let prodcut_map_content = document.querySelector(`.product_map${i+12*nextPage}`)
                        let mapImg=document.createElement("img");
                        mapImg.className=" product_map_photo"
                        mapImg.src="/static/image/22.png"
                        mapImg.setAttribute("width", "24");
                        mapImg.setAttribute("height", "24");
                        prodcut_map_content.appendChild(mapImg);
                        restaurant_content.appendChild(prodcut_map_content);

                        let mapText=document.createElement("div")
                        mapText.className="map_text"
                        let mapTextNode = document.createTextNode(jsonData.data[i].county);
                        mapText.appendChild(mapTextNode);
                        prodcut_map_content.appendChild(mapText)

                        // 在圖片中建立愛心
                        let prodcut_love = document.createElement("button")
                        prodcut_love.className = `product_love${i+12*nextPage}`;
                        prodcut_love.id="love"+store_id;
                        restaurant_content.appendChild(prodcut_love);
                        prodcut_love.setAttribute("onclick","event.preventDefault(); homefavorite(this.id);" )
                        let prodcut_love_content = document.querySelector(`.product_love${i+12*nextPage}`)
                        let loveImg=document.createElement("img");
                        loveImg.className=" product_love_photo";
                        // loveImg.id="love"+store_id
                        loveImg.src="/static/image/heart.png";
                        loveImg.setAttribute("width", "24");
                        loveImg.setAttribute("height", "24");
                        prodcut_love_content.appendChild(loveImg);
                        restaurant_content.appendChild(prodcut_love_content);

                        // 建立紅色愛心
                        let prodcut_redlove = document.createElement("button")
                        prodcut_redlove.className = `product_redlove${i+12*nextPage}`;
                        prodcut_redlove.id="redlove"+store_id;
                        prodcut_redlove.setAttribute("onclick","event.preventDefault(); unhomefavorite(this.id);" )
                        restaurant_content.appendChild(prodcut_redlove);
                        let prodcut_redlove_content = document.querySelector(`.product_redlove${i+12*nextPage}`)
                        let redloveImg=document.createElement("img");
                        redloveImg.className=" product_redlove_photo";
                        // redloveImg.id="redlove"+store_id;
                        redloveImg.src="/static/image/red_heart.png";
                        redloveImg.setAttribute("width", "24");
                        redloveImg.setAttribute("height", "24");
                        prodcut_redlove_content.appendChild(redloveImg);
                        restaurant_content.appendChild(prodcut_redlove_content);

                        // 建立information
                        let informationElement = document.createElement("div");
                        informationElement.className = `information${i+12*nextPage}`;
                        restaurant_content.appendChild(informationElement);

                        // information 底下建立name phone adress的div
                        let informationDiv = document.querySelector(`.restaurant_information${i+12*nextPage} .information${i+12*nextPage}`);
                        // 建立store name
                        let storeName = document.createElement("div");
                        storeName.className = "store_name";
                        let storeNode = document.createTextNode(jsonData.data[i].store_name);
                        storeName.appendChild(storeNode);
                        informationElement.appendChild(storeName);
                        // 建立 電話
                        let phoneElement = document.createElement("div");
                        phoneElement.className = "phone";
                        let phoneNode = document.createTextNode(jsonData.data[i].phone);
                        phoneElement.appendChild(phoneNode);
                        informationElement.appendChild(phoneElement);
                        // 建立 地址
                        let addressElement = document.createElement("div");
                        addressElement.className = "address";
                        let addressNode = document.createTextNode(straddress[1]);
                        addressElement.appendChild(addressNode);
                        informationElement.appendChild(addressElement);

                    }
                    
                    nextPage = jsonData.nextPage;
                    fetch("/api/user/auth", {
                        method: "GET",
                    })
                    .then((response) => {
                        // 這裡會得到一個 ReadableStream 的物件
                        // 可以透過 blob(), json(), text() 轉成可用的資訊
                        return response.json();
                    }).then((jsonData) => {
                        if (jsonData.data != false) {
                            fetch("/api/favorites",{
                                method: "GET",
                            })
                            .then((response)=>{
                                return response.json();
                            }).then((jsonData)=>{
 
                        
                                if(jsonData.data !== null){
                                    for(i=0;i<jsonData.data.length;i++){
                                        // console.log(jsonData.data,"1")
                                        let favorite_id=jsonData.data[i].favorite
                                        favorite_id=parseFloat(favorite_id)
                                        if (store_id_list.includes(favorite_id)) {
                                            const loveButton = document.querySelector(`#love${favorite_id}`);
                                           
                                            const redLoveButton = document.querySelector(`#redlove${favorite_id}`);
                                            loveButton.style.display = "none";
                                            redLoveButton.style.display = "block";
                            
                                        }
                                    }
                                   
                                }
                            })
                        }
                        
                    
                        
                    })
                })
                
        }
    }
}
// 點擊縣市時出現各縣市的親子餐廳
// // 這裡是搜尋按鈕時
// document.querySelectorAll('a').forEach(function(element) {
//     element.addEventListener('click', function(event) {
//         var clickedCity = event.target.innerHTML;
//         console.log(clickedCity);
//     });
// });

let clickedCity = ""
// 這邊是點擊哪個縣市時抓到縣市名稱
document.querySelectorAll('a').forEach(function(element) {
    element.addEventListener('click', function(event) {
        clickedCity = event.target.innerHTML;
        // console.log(clickedCity);
    });
});

function apiRestaurant(clickedCity) {
    // 先停止聆聽
    observer.unobserve(cards);
    //  先清空網頁
    document.getElementById("content").innerHTML = "";
    // 讓nextPage先回到0

    // const data = {username}
    console.log('apiRestaurant function called with location: ' + location);
    fetch(`/api/restaurant?keyword=${clickedCity}`, {})
        .then((response) => {
        
            return response.json();
        }).then((jsonData) => {
            for (let i = 0; i < jsonData.data.length; i++) {
                let store_id= jsonData.data[i].id;
                let address = jsonData.data[i].address;
                let straddress = address.split('台灣');
                let content = document.querySelector("#content");
                //新增一個連結在最外層
                let restaurantLink = document.createElement("a");
                store_id_list.push(store_id);
                // console.log(typeof store_id,"oooooo")
                // console.log(store_id_list,"aaaaaa")
                restaurantLink.className = `restaurant_link${i}`;
                restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                content.appendChild(restaurantLink);

                // 建立restaurant information div
                let restaurantDiv = document.createElement("div");
                restaurantDiv.className = `restaurant_information${i}`;
                restaurantLink.appendChild(restaurantDiv);

                // 建立圖片在 restaurantDiv 中
                let restaurant_content=document.querySelector(`.restaurant_information${i}`);
                let imgDiv = document.createElement("div")
                imgDiv.className = "imgDiv"
                let img=document.createElement("img");
                img.className="restaurant_image";
                img.src="https://"+jsonData.data[i].image[0];
                imgDiv.appendChild(img)
                restaurant_content.appendChild(imgDiv);

                // 建立圖片上的地標位置
                let prodcut_map = document.createElement("div")
                prodcut_map.className = `product_map${i}`;
                restaurant_content.appendChild(prodcut_map);
                let prodcut_map_content = document.querySelector(`.product_map${i}`)
                let mapImg=document.createElement("img");
                mapImg.className=" product_map_photo"
                mapImg.src="/static/image/22.png"
                mapImg.setAttribute("width", "24");
                mapImg.setAttribute("height", "24");
                prodcut_map_content.appendChild(mapImg);
                restaurant_content.appendChild(prodcut_map_content);

                let mapText=document.createElement("div")
                mapText.className="map_text"
                let mapTextNode = document.createTextNode(jsonData.data[i].county);
                mapText.appendChild(mapTextNode);
                prodcut_map_content.appendChild(mapText)

                // 在圖片中建立愛心
                let prodcut_love = document.createElement("button")
                prodcut_love.className = `product_love${i}`;
                prodcut_love.id="love"+store_id;
                prodcut_love.setAttribute("onclick","event.preventDefault(); homefavorite(this.id);" )
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i}`)
                let loveImg=document.createElement("img");
                loveImg.className=" product_love_photo"
                loveImg.src="/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);

                // 建立紅色愛心
                let prodcut_redlove = document.createElement("button")
                prodcut_redlove.className = `product_redlove${i}`;
                prodcut_redlove.id="redlove"+store_id;
                prodcut_redlove.setAttribute("onclick","event.preventDefault(); unhomefavorite(this.id);" )
                restaurant_content.appendChild(prodcut_redlove);
                let prodcut_redlove_content = document.querySelector(`.product_redlove${i}`)
                let redloveImg=document.createElement("img");
                redloveImg.className=" product_redlove_photo";
                // redloveImg.id="redlove"+store_id;
                redloveImg.src="/static/image/red_heart.png";
                redloveImg.setAttribute("width", "24");
                redloveImg.setAttribute("height", "24");
                prodcut_redlove_content.appendChild(redloveImg);
                restaurant_content.appendChild(prodcut_redlove_content);

                // 建立information
                let informationElement = document.createElement("div");
                informationElement.className = `information${i}`;
                restaurant_content.appendChild(informationElement);

                // information 底下建立name phone adress的div
                let informationDiv = document.querySelector(`.restaurant_information${i} .information${i}`);
                // 建立store name
                let storeName = document.createElement("div");
                storeName.className = "store_name";
                let storeNode = document.createTextNode(jsonData.data[i].store_name);
                storeName.appendChild(storeNode);
                informationElement.appendChild(storeName);
                // 建立 電話
                let phoneElement = document.createElement("div");
                phoneElement.className = "phone";
                let phoneNode = document.createTextNode(jsonData.data[i].phone);
                phoneElement.appendChild(phoneNode);
                informationElement.appendChild(phoneElement);
                // 建立 地址
                let addressElement = document.createElement("div");
                addressElement.className = "address";
                let addressNode = document.createTextNode(straddress[1]);
                addressElement.appendChild(addressNode);
                informationElement.appendChild(addressElement);

            }
            nextPage = jsonData.nextPage;
            keyword = clickedCity;
            observer.observe(cards);
            //  判斷是否有登入如果有登入就看看是否有喜愛的餐廳,而且是一開始仔入的這12個餐聽
        fetch("/api/user/auth", {
            method: "GET",
        })
        .then((response) => {
            // 這裡會得到一個 ReadableStream 的物件
            // 可以透過 blob(), json(), text() 轉成可用的資訊
            return response.json();
        }).then((jsonData) => {
            if (jsonData.data != false) {
                fetch("/api/favorites",{
                    method: "GET",
                })
                .then((response)=>{
                    return response.json();
                }).then((jsonData)=>{
                    // console.log(jsonData);
                    // console.log(jsonData.data,"favorite");
                    // console.log(jsonData.data[0].favorite,"favorite22");
                    // console.log(`#love${favorite_id}`)
            
                    if(jsonData.data !== null){
                        for(i=0;i<jsonData.data.length;i++){
                            // console.log(jsonData.data,"1")
                            let favorite_id=jsonData.data[i].favorite
                            favorite_id=parseFloat(favorite_id)
                            if (store_id_list.includes(favorite_id)) {
                                const loveButton = document.querySelector(`#love${favorite_id}`);
                                // console.log(loveButton,"loveButton")
                                const redLoveButton = document.querySelector(`#redlove${favorite_id}`);
                                loveButton.style.display = "none";
                                redLoveButton.style.display = "block";
                                
                            }
                        }
                       
                    }
                })
            }
            
        
            
        })
        })
}


restaurant()

// 追蹤footer
let observer = new IntersectionObserver(callback, options)
const cards = document.querySelector("footer");


let redbuttons = document.querySelectorAll('button[id^="love"]');


function homefavorite(buttonId){

    
    console.log(buttonId);
    let parts = buttonId.split("love");
    let restaurant_id = parts.pop();
    console.log(restaurant_id,"restaurant_id")

    fetch("/api/user/auth", {
        method: "GET",
    })
    .then((response) => {
        // 這裡會得到一個 ReadableStream 的物件
        // 可以透過 blob(), json(), text() 轉成可用的資訊
        return response.json();
    }).then((jsonData) => {
        if (jsonData.data == false) {
            // 打開註冊頁面
            openLogin();
        }
        else{
            console.log(jsonData.data)
            let favoriteElement = document.querySelector(`#${buttonId}`);
            let unfavoriteElement = document.querySelector('#red'+buttonId);
            favoriteElement.style.display = "none";
            unfavoriteElement.style.display ="flex";
            let data=
            {
                id:jsonData.data.id,
                restaurant_id:restaurant_id
                
            };
            fetch("/api/favorites",{
                method: "POST" ,
                credentials: "include",
                body:JSON.stringify(data),
                cache:"no-cache",
                headers:new Headers({
                    "content-type":"application/json"
                })
            })
            
        }
        
    })
}

function unhomefavorite(redbuttonId){
    // console.log(redbuttonId);
    let parts = redbuttonId.split("love");
    let restaurant_id = parts.pop();
    // console.log(restaurant_id,"restaurant_id")
    // '#red'+redbuttonId
    let favoriteElement = document.querySelector('#love'+restaurant_id);
    let unfavoriteElement = document.querySelector(`#${redbuttonId}`);
    favoriteElement.style.display = "block";
    unfavoriteElement.style.display ="none";

    let data=
        {
            restaurant_id:restaurant_id
        };
    // console.log(data,"要傳的資料")
    fetch("/api/favorites",{
        method: "DELETE" ,
        credentials: "include",
        body:JSON.stringify(data),
        cache:"no-cache",
        headers:new Headers({
            "content-type":"application/json"
        })
    })

}
