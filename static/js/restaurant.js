
function restaurantID()
{
    let s = location.href;
    let path = location.pathname;
    // console.log(s);
    // console.log(path);
    
    // 這邊是將頁面抓到輸入的字串
    fetch(`/api/${path}`, {})
    .then((response) => {
        // 這裡會得到一個 ReadableStream 的物件
        // 可以透過 blob(), json(), text() 轉成可用的資訊
        return response.json(); 
    }).then((jsonData) => {
        // console.log(jsonData);
        let store_name= jsonData.data.store_name;
        let rating = jsonData.data.rating;
        let address = jsonData.data.address;
        let straddress = address.split('台灣');
        let place_id=jsonData.data.place_id;
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
                // console.log(jsonData.data);
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
                        expandBtn.innerText = "展開";
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
// 點擊儲存我的最愛
