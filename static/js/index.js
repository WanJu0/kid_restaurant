let nextPage = 0;
let isLoading = false;
let keyword = "";

function restaurant() {
    // 這邊是將頁面抓到輸入的字串
    fetch(`/api/restaurant?page=${nextPage}`, {})
        .then((response) => {
            // 這裡會得到一個 ReadableStream 的物件
            // 可以透過 blob(), json(), text() 轉成可用的資訊
            return response.json();
        }).then((jsonData) => {
            for (let i = 0; i < jsonData.data.length; i++) {
                let address = jsonData.data[i].address;
                let straddress = address.split('台灣');
                let content = document.querySelector("#content");
                
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
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i}`)
                let loveImg=document.createElement("img");
                loveImg.className=" product_love_photo"
                loveImg.src="/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);






                // 新增一個連結在information最外層
                // let restaurantLink = document.createElement("a");
                // restaurantLink.className = `restaurant_link${i}`;
                // restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                // restaurant_content.appendChild(restaurantLink);

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
                    // 這裡會得到一個 ReadableStream 的物件
                    // 可以透過 blob(), json(), text() 轉成可用的資訊
                    return response.json();
                }).then((jsonData) => {

                    for (let i = 0; i < jsonData.data.length; i++) {
                        let address = jsonData.data[i].address;
                        let straddress = address.split('台灣');
                        let content = document.querySelector("#content");
                        //新增一個連結在最外層
                        let restaurantLink = document.createElement("a");
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
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i+12*nextPage}`)
                let loveImg=document.createElement("img");
                loveImg.className=" product_love_photo"
                loveImg.src="/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);

                    


                    // // 新增一個連結在information最外層
                    // let restaurantLink = document.createElement("a");
                    // restaurantLink.className = `restaurant_link${i+12*nextPage}`;
                    // restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                    // restaurant_content.appendChild(restaurantLink);
                        
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
    fetch(`/api/restaurant?keyword=${clickedCity}`, {})
        .then((response) => {
            // 這裡會得到一個 ReadableStream 的物件
            // 可以透過 blob(), json(), text() 轉成可用的資訊
            return response.json();
        }).then((jsonData) => {
            for (let i = 0; i < jsonData.data.length; i++) {
                let address = jsonData.data[i].address;
                let straddress = address.split('台灣');
                let content = document.querySelector("#content");
                //新增一個連結在最外層
                let restaurantLink = document.createElement("a");
                restaurantLink.className = `restaurant_link${i}`;
                restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                content.appendChild(restaurantLink);

                // 建立restaurant information div
                let restaurantDiv = document.createElement("div");
                restaurantDiv.className = `restaurant_information${i}`;
                restaurantLink.appendChild(restaurantDiv);

                // // 建立圖片在 restaurantDiv 中
                // let restaurant_content = document.querySelector(`.restaurant_information${i}`);
                // // 在下面創一個photo_list div
                // let photoDiv = document.createElement("div");
                // photoDiv.className = `photo_list${i}`;
                // let dotDiv = document.createElement("div");
                // dotDiv.className = `dot_content${i}`;
                // photoDiv.appendChild(dotDiv);
                // restaurant_content.appendChild(photoDiv)
                // // console.log(jsonData.data[i].image.length)
                // let photo_content = document.querySelector(`.photo_list${i}`);
                // // 建立button左右按鈕
                // let buttonLeft = document.createElement("button");
                // buttonLeft.className = "btn_left";
                // buttonLeft.setAttribute("onclick", "setTimeout(function(){plusDivs(-1)}, 100)");
                // let left_img = document.createElement("img");
                // left_img.className = "icon_left";
                // left_img.src = "/static/image/btn_leftArrowbutton.png";
                // left_img.setAttribute("width", "30");
                // left_img.setAttribute("height", "30");
                // buttonLeft.appendChild(left_img);
                // photo_content.appendChild(buttonLeft);

                // let buttonRight = document.createElement("button");
                // buttonRight.className = "btn_right";
                // buttonRight.setAttribute("onclick", "setTimeout(function(){plusDivs(1)}, 100)");
                // let right_img = document.createElement("img");
                // right_img.className = "icon_right";
                // right_img.src = "/static/image/btn_rightArrowbutton.png";
                // right_img.setAttribute("width", "30");
                // right_img.setAttribute("height", "30");
                // buttonRight.appendChild(right_img);
                // photo_content.appendChild(buttonRight);


                // restaurant_content.appendChild(photo_content);

                // for (let j = 0; j < jsonData.data[i].image.length; j++) {
                   
                //     let photo_img = document.createElement("img");
                //     photo_img.className = "photo_list_content";
                //     photo_img.src ="https://"+ jsonData.data[i].image[j];

                //     photo_content.appendChild(photo_img);

                //     let dot_content = document.querySelector(`.dot_content${i}`);
                //     let dots = document.createElement("span");
                //     dots.className = "dot";
                //     dots.setAttribute("onclick", `currentSlide(${j+1})`)
                //     dot_content.appendChild(dots);
               
                // }
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
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i}`)
                let loveImg=document.createElement("img");
                loveImg.className=" product_love_photo"
                loveImg.src="/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);


                // // 新增一個連結在information最外層
                // let restaurantLink = document.createElement("a");
                // restaurantLink.className = `restaurant_link${i}`;
                // restaurantLink.href=`/restaurant/${jsonData.data[i].id}`;
                // restaurant_content.appendChild(restaurantLink);

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
        })
}
let divName = "";
document.addEventListener("click", function(event) {
    let target = event.target;
    let parent = target.parentNode;
    divName = parent.parentNode.className
    console.log(divName)
});

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusDivs(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides;
    console.log(divName, "裡面的div")
    if (divName) {
        slides = document.querySelectorAll('.' + divName + ' .photo_list_content');
    } else {
        slides = document.querySelectorAll('.photo_list_content');
    }

    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    if (slides.length) {
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }


}

restaurant()

// 追蹤footer
let observer = new IntersectionObserver(callback, options)
const cards = document.querySelector("footer");