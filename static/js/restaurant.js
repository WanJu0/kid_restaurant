
function restaurantID()
{
    let s = location.href;
    let path = location.pathname;
   
    fetch(`/api/${path}`, {})
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        // console.log(jsonData);
        let store_name= jsonData.data.store_name;
        let rating = jsonData.data.rating;
        let address = jsonData.data.address;
        let straddress = address.split('台灣');
        let place_id=jsonData.data.place_id;
        
        let locationDiv = document.querySelector(".location_page");
        let locationlink = document.createElement("div");
        locationlink.textContent = jsonData.data.county;
        locationlink.addEventListener("click", function() {
        // 當點擊該元素時，返回上一頁
             window.history.back();
        });
        locationDiv.appendChild(locationlink);

        let restaurnatDiv = document.querySelector(".restaurant_page");
        let restaurnatlink = document.createElement("div");
        restaurnatlink.textContent = store_name;
        restaurnatDiv.appendChild(restaurnatlink);


        
        // let locationDiv = document.querySelector(".location_page");
        // let locationlink = document.createElement("div");
        // locationlink.textContent = jsonData.data.county;
        // locationlink.setAttribute("onclick", "apiRestaurant(this.innerHTML)");
        // locationDiv.appendChild(locationlink);


        if(jsonData.data.opening_hours==false){
            document.querySelector(".store_time").innerHTML ="休息中";
        }
        else{
            document.querySelector(".store_time").innerHTML ="營業中";
        }
        
        let weeklyDiv=document.querySelector(".weekly_time")
        for(i=0; i<jsonData.data.weekday_text.length;i++){
            let weeklyElement = document.createElement("div");
            weeklyElement.className = `weekly${i}`;
            let weeklyNode = document.createTextNode(jsonData.data.weekday_text[i]);
            weeklyElement.appendChild(weeklyNode);
            weeklyDiv.appendChild(weeklyElement);
        }
        document.querySelector(".store_title").innerHTML = jsonData.data.store_name;
        document.querySelector(".google_rent").innerHTML = jsonData.data.rating;
        document.querySelector(".google_location").innerHTML = jsonData.data.county+","+jsonData.data.district;
        document.querySelector(".store_phone").innerHTML = "電話 : "+jsonData.data.phone;
        setTimeout(() => {
            document.querySelector(".photo_1").src ="https://"+ jsonData.data.image[0];
        }, 20);
        
        setTimeout(() => {
            document.querySelector(".photo_2").src ="https://"+ jsonData.data.image[1];
        }, 40);
        
        setTimeout(() => {
            document.querySelector(".photo_3").src ="https://"+  jsonData.data.image[2];
        }, 60);
        
        setTimeout(() => {
            document.querySelector(".photo_4").src ="https://"+  jsonData.data.image[3];
        }, 80);
        
        setTimeout(() => {
            document.querySelector(".photo_5").src = "https://"+ jsonData.data.image[4];
        }, 100);
        document.querySelector(".store_address").innerHTML = straddress[1];
        // 抓取google comment
        fetch(`/api/google_comment/${place_id}`,{})
            .then((response) =>{
                return response.json();
            }).then((jsonData)=>{
                console.log(jsonData.data);
                for (let i =0; i< jsonData.data.length; i++){

                    let content = document.querySelector(".google_comment_div");
                    let googleDiv = document.createElement("div");
                    googleDiv.className = `google_comment${i}`;
                    content.appendChild(googleDiv);

                    // 建立google_information
                    let google_information_content =document.querySelector(`.google_comment${i}`);
                    let informationDiv = document.createElement("div");
                    informationDiv.className = `google_information${i}`;
                    // googleDiv.appendChild(informationDiv);


                    // information 底下建立 user_img和 user
                    let user_img =document.createElement("img");
                    user_img.className ="member_icon";
                    user_img.src = jsonData.data[i].profile_photo_url;
                    user_img.setAttribute("width", "40");
                    user_img.setAttribute("height", "40");
                    informationDiv.appendChild(user_img);
                    googleDiv.appendChild(informationDiv);
                    // content.appendChild(informationDiv);

                    let userDiv = document.createElement("div");
                    userDiv.className = "google_user";
                    let userNode = document.createTextNode(jsonData.data[i].author_name);
                    userDiv.appendChild(userNode);
                    informationDiv.appendChild(userDiv);
                    googleDiv.appendChild(informationDiv);
                    // content.appendChild(informationDiv);

                    // 給予幾顆星
                    let star_img =document.createElement("img");
                    star_img.className ="star_icon";
                    star_img.src = "/static/image/1985836.png";
                    star_img.setAttribute("width", "20");
                    star_img.setAttribute("height", "20");
                    informationDiv.appendChild(star_img);
                    googleDiv.appendChild(informationDiv);


                    let ratingtDiv = document.createElement("div");
                    ratingtDiv.className = `google_rating${i}`;
                    let rating = document.createElement("p")
                    let ratingNode = document.createTextNode(":"+jsonData.data[i].rating+".0");
                    rating .appendChild(ratingNode );
                    ratingtDiv.appendChild(rating );
                    informationDiv.appendChild(ratingtDiv);
                    googleDiv.appendChild(informationDiv);
                    


                    // 評論內容
                    let textDiv = document.createElement("div");
                    textDiv.className = `google_user_comment${i}`;
                    let textP = document.createElement("p")
                    let textNode = document.createTextNode(jsonData.data[i].text);
                    textP.appendChild(textNode);
                    textDiv.appendChild(textP);
                    googleDiv.appendChild(textDiv);

                    // 留言時間
                    let dateDiv = document.createElement("div");
                    dateDiv.className = "google_comment_date";
                    let dateNode = document.createTextNode(jsonData.data[i].relative_time_description);
                    dateDiv.appendChild(dateNode);
                    googleDiv.appendChild(dateDiv);


                    let pHeight = textP.offsetHeight;
                    let lineHeight = parseInt(window.getComputedStyle(textP).lineHeight);

                    // 如果行數大於五行，加入 CSS 屬性
                    if (pHeight > 5 * lineHeight){
                        textP.style.display = '-webkit-box';
                        textP.style.boxOrient = "vertical";
                        textP.style.WebkitBoxOrient = "vertical";
                        textP.style.webkitLineClamp = '4';
                        
                        // 建立展開按鈕
                        let expandBtn_content =document.querySelector(`.google_user_comment${i}`);
                        let expandBtn = document.createElement("button");
                        expandBtn.innerText = "展開 ";
                        expandBtn.style.display = "block";
                        expandBtn.addEventListener("click", function() {
                            if (expandBtn.innerText === "展開") {
                                textP.style.display = "block";
                                expandBtn.innerText = "收起";
                            } else {
                                textP.style.display = "-webkit-box";
                                textP.style.boxOrient = "vertical";
                                textP.style.WebkitBoxOrient = "vertical";
                                textP.style.webkitLineClamp = "4";
                                expandBtn.innerText = "展開";
                            }
                        });
                        expandBtn_content.appendChild(expandBtn);
                    }
                    else{
                        // 
                    }


                }
            })

    })
}
restaurantID()

// 抓取此餐廳的所有人評論,並顯示在頁面上

function restaurantMessage(){
    let path = location.pathname;
    let parts = path.split("/");
    let restaurant_id = parts.pop();
    fetch(`/api/messages/restaurant/${restaurant_id}`, {})
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        console.log(jsonData.data,"jsonData.data")
        for (let i =0; i< jsonData.data.length; i++){
            let user_id = jsonData.data[i].user_id;
            let message_content =jsonData.data[i].message_content;
            let message_photo = jsonData.data[i].message_photo;
            let user_photo =jsonData.data[i].user_photo;
            let date = jsonData.data[0].date.substring(0, 10);
            let user_name=jsonData.data[i].user_name;

            let content = document.querySelector(".comment_content");
            let googleDiv = document.createElement("div");
            googleDiv.className = `comment${i}`;
            content.appendChild(googleDiv);

            // 建立google_information
            let google_information_content =document.querySelector(`.comment${i}`);
            let informationDiv = document.createElement("div");
            informationDiv.className = `information${i}`;
            // googleDiv.appendChild(informationDiv);


            // information 底下建立 user_img和 user
            let user_img =document.createElement("img");
            user_img.className ="member_icon";
            if (user_photo) {
                user_img.src = user_photo;
              } else {
                user_img.src = "/static/image/member.png";
              }
            user_img.setAttribute("width", "40");
            user_img.setAttribute("height", "40");
            informationDiv.appendChild(user_img);
            googleDiv.appendChild(informationDiv);
            // content.appendChild(informationDiv);

            let userDiv = document.createElement("div");
            userDiv.className = "user";
            let userNode = document.createTextNode(user_name);
            userDiv.appendChild(userNode);
            informationDiv.appendChild(userDiv);
            googleDiv.appendChild(informationDiv);
           
            // 評論內容
            let textDiv = document.createElement("div");
            textDiv.className = `user_comment${i}`;
            let textP = document.createElement("p")
            let textNode = document.createTextNode(message_content);
            textP.appendChild(textNode);
            textDiv.appendChild(textP);
            googleDiv.appendChild(textDiv);

            let comment_content =document.querySelector(`.user_comment${i}`);

            // 如果留言有圖片,則將照片放上去
            if (message_photo !=null){
                
                let message_img =document.createElement("img");
                message_img.className ="message_photo";
                message_img.src = message_photo;
                message_img.setAttribute("width", "100");
                message_img.setAttribute("height", "80");
                comment_content.appendChild(message_img);
                // googleDiv.appendChild(informationDiv);

            }

            // 留言時間
            let dateDiv = document.createElement("div");
            dateDiv.className = "comment_date";
            let dateNode = document.createTextNode(date);
            dateDiv.appendChild(dateNode);
            googleDiv.appendChild(dateDiv);
        }
    })
}

restaurantMessage()

// 