let member_id = "";
let member_name = "";
let store_id_list = [];
let message_file = "";

fetch("/api/user/auth", {
        method: "GET",
    })
    .then((response) => {
        return response.json();
    }).then((jsonData) => {
        if (jsonData.data == false) {
            window.location.href = "/"
        } else {
            member_id = jsonData.data["id"];
            member_name = jsonData.data["name"];
            const member_email = jsonData.data["email"];
            document.getElementById("input_name").value = member_name;
            document.getElementById("input_mail").value = member_email;
            myMessage()
        }

    })

// 再點選大頭照那邊再選擇完照片後直接上傳更新
function update_member_photo() {
    const inputElement = document.querySelector('#img_input2');
    inputElement.addEventListener('change', (e) => {
        let file = e.target.files[0]; //取得檔案資訊
        // 创建一个包含原文件内容的 Blob
        const fileBlob = new Blob([file], {
            type: file.type
        });

        const originalFileName = file.name; 
        const newFileName = `${member_id}.${file.type.split('/')[1]}`; 
        const newFile = new File([fileBlob], newFileName, {
            type: file.type
        });
        
        if (!file.type.match('image.*')) {
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        

        // 渲染文件
        reader.onload = (arg) => {
            const previewBox = document.querySelector('.add_photo');
            previewBox.src = arg.target.result;
        }

        const formData = new FormData();
        const a = formData.append('img', newFile);
        fetch("/api/member/photo", {
                method: 'POST',
                body: formData,
            })
            .then((response) => {
                return response.json();
            }).then((jsonData) => {
               
            })
    });
}
// 顯示所有我收藏的餐廳資訊
function myFavorite() {
    fetch("/api/favorites", {})
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            
            for (let i = 0; i < jsonData.data.length; i++) {

                let store_id = jsonData.data[i].favorite_restaurant_id;;
                let address = jsonData.data[i].address;
                let straddress = address.split('台灣');
                let content = document.querySelector(".favorite_down");
                //新增一個連結在最外層
                let restaurantLink = document.createElement("a");
                store_id_list.push(store_id);
                
                restaurantLink.className = `restaurant_link${i}`;
                restaurantLink.href = `/restaurant/${jsonData.data[i].favorite_restaurant_id}`;
                content.appendChild(restaurantLink);

                // 建立restaurant information div
                let restaurantDiv = document.createElement("div");
                restaurantDiv.className = `restaurant_information${i}`;
                restaurantLink.appendChild(restaurantDiv);

                // 建立圖片在 restaurantDiv 中
                let restaurant_content = document.querySelector(`.restaurant_information${i}`);
                let imgDiv = document.createElement("div")
                imgDiv.className = "imgDiv"
                let img = document.createElement("img");
                img.className = "restaurant_image";
                img.src = "https://" + jsonData.data[i].image[0];
                imgDiv.appendChild(img)
                restaurant_content.appendChild(imgDiv);

                // 建立圖片上的地標位置
                let prodcut_map = document.createElement("div")
                prodcut_map.className = `product_map${i}`;
                restaurant_content.appendChild(prodcut_map);
                let prodcut_map_content = document.querySelector(`.product_map${i}`)
                let mapImg = document.createElement("img");
                mapImg.className = " product_map_photo"
                mapImg.src = "/static/image/22.png"
                mapImg.setAttribute("width", "24");
                mapImg.setAttribute("height", "24");
                prodcut_map_content.appendChild(mapImg);
                restaurant_content.appendChild(prodcut_map_content);

                let mapText = document.createElement("div")
                mapText.className = "map_text"
                let mapTextNode = document.createTextNode(jsonData.data[i].county);
                mapText.appendChild(mapTextNode);
                prodcut_map_content.appendChild(mapText)

                // 在圖片中建立愛心
                let prodcut_love = document.createElement("button")
                prodcut_love.className = `product_love${i}`;
                prodcut_love.id = "love" + store_id;
                prodcut_love.setAttribute("onclick", "event.preventDefault(); homefavorite(this.id);")
                restaurant_content.appendChild(prodcut_love);
                let prodcut_love_content = document.querySelector(`.product_love${i}`)
                let loveImg = document.createElement("img");
                loveImg.className = " product_love_photo"
                loveImg.src = "/static/image/heart.png"
                loveImg.setAttribute("width", "24");
                loveImg.setAttribute("height", "24");
                prodcut_love_content.appendChild(loveImg);
                restaurant_content.appendChild(prodcut_love_content);

                // 建立紅色愛心
                let prodcut_redlove = document.createElement("button")
                prodcut_redlove.className = `product_redlove${i}`;
                prodcut_redlove.id = "redlove" + store_id;
                prodcut_redlove.setAttribute("onclick", "event.preventDefault(); member_unfavorite(this.id);")
                restaurant_content.appendChild(prodcut_redlove);
                let prodcut_redlove_content = document.querySelector(`.product_redlove${i}`)
                let redloveImg = document.createElement("img");
                redloveImg.className = " product_redlove_photo";
               
                redloveImg.src = "/static/image/red_heart.png";
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

        })
}

myFavorite();

let messageId = "";
// 顯示我所有的評論
function myMessage() {
    fetch(`/api/messages/${member_id}`, {})
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            for (let i = 0; i < jsonData.data.length; i++) {
                let user_id = jsonData.data[i].user_id;
                let message_content = jsonData.data[i].message_content;
                let message_photo = jsonData.data[i].message_photo;
                let user_photo = jsonData.data[i].user_photo
                let date = jsonData.data[0].date.substring(0, 10)
                let messages_id = jsonData.data[i].messages_id
                let store_name = jsonData.data[i].store_name
                

                let content = document.querySelector(".comment_content");
                let visitorDiv = document.createElement("div");
                visitorDiv.className = `member_comment${i}`;
                visitorDiv.id = "message_id" + messages_id;
                content.appendChild(visitorDiv);

                // 建立google_information
                let google_information_content = document.querySelector(`.member_comment${i}`);
                let informationDiv = document.createElement("div");
                informationDiv.className = `message_information${i}`;
                
                // information 底下建立 user_img和 user
                let user_img = document.createElement("img");
                user_img.className = "member_photo";

                if (user_photo !== null) {
                    user_img.src = user_photo;
                } else {
                    user_img.src = "/static/image/member.png"
                }

                user_img.setAttribute("width", "40");
                user_img.setAttribute("height", "40");
                informationDiv.appendChild(user_img);
                visitorDiv.appendChild(informationDiv);
               

                let userDiv = document.createElement("div");
                userDiv.className = "member_name";
                let userNode = document.createTextNode(member_name);
                userDiv.appendChild(userNode);
                informationDiv.appendChild(userDiv);
                visitorDiv.appendChild(informationDiv);

                
                let modify_img = document.createElement("img");
                modify_img.className = "dot_photo";
                modify_img.id = ""
                modify_img.src = "/static/image/dot_2.png"
                modify_img.setAttribute("width", "20");
                modify_img.setAttribute("height", "20");

    
                modify_img.addEventListener("click", (event) => {
                    // 獲取圖像座標
                    let imgRect = modify_img.getBoundingClientRect();
                    let imgX = imgRect.left;
                    let imgY = imgRect.top;

                    // 獲取父級 div 的 id
                    let grandParentId = modify_img.parentNode.parentNode.id;
                    messageId = grandParentId.split('message_id')[1];
                    console.log(messageId)


                    // 創建彈出框並設置位置
                    let popupDiv = document.createElement("div");
                    popupDiv.className = "popup_div";
                    popupDiv.style.position = "absolute";
                    popupDiv.style.right = "10px";
                    popupDiv.style.top = "40px";
                    visitorDiv.appendChild(popupDiv);


                    // 創建修改按鈕
                    let modifyBtn = document.createElement("button");
                    modifyBtn.innerText = "修改";
                    modifyBtn.className = "popup_button";
                    popupDiv.appendChild(modifyBtn);
                    let popArrow = document.createElement("div");
                    popArrow.className = "popArrow";
                    popupDiv.appendChild(popArrow);


                    modifyBtn.addEventListener("click", () => {
                        // 當修改按鈕被點擊時的操作,跳出標及畫框並放入原本的圖片和文字,送出時用更新的方式更新message編號的內容
                        openMessage();
                        fetch(`/api/messages_id/${messageId}`, {
                                method: 'GET',
                            })
                            .then((response) => {
                                return response.json();
                            }).then((jsonData) => {
                                let message_photo = jsonData.data[0].message_photo;

                                document.querySelector(".message_name").innerHTML = "更新評論-" + jsonData.data[0].store_name
                                
                                document.querySelector(".user-message-textarea").innerHTML = jsonData.data[0].message_content
                            })
                        //   popupDiv.remove();

                    });


                    // 創建刪除按鈕,刪除message編號內容
                    let deleteBtn = document.createElement("button");
                    deleteBtn.innerText = "刪除留言";
                    deleteBtn.className = "delete_button";
                    popupDiv.appendChild(deleteBtn);
                    deleteBtn.addEventListener("click", () => {
                        let data = {
                            messageId: messageId,
                        };
                        console.log(data, "request")
                        fetch("/api/messages", {
                                method: "DELETE",
                                body: JSON.stringify(data),
                                cache: "no-cache",
                                headers: new Headers({
                                    "content-type": "application/json"
                                })
                            })
                            .then((response) => {
                                return response.json();
                            }).then((jsonData) => {

                                window.location.href = "/member";

                            })
                        popupDiv.remove();
                    });

                    // 創建取消按鈕
                    let cancelBtn = document.createElement("button");
                    cancelBtn.innerText = "取消";
                    cancelBtn.className = "cancel_button";
                    popupDiv.appendChild(cancelBtn);
                    cancelBtn.addEventListener("click", () => {
                        popupDiv.remove();
                    });


                });
                informationDiv.appendChild(modify_img);
                visitorDiv.appendChild(informationDiv);

                // 評論的餐廳名稱
                let store_nameDiv = document.createElement("div");
                store_nameDiv.className = `message_store_name_div`;
                let storeP = document.createElement("div")
                storeP.className = `message_store_name`;
                let storeNode = document.createTextNode(store_name);
                storeP.appendChild(storeNode);
                store_nameDiv.appendChild(storeP);
                visitorDiv.appendChild(store_nameDiv);
                // 評論內容
                let textDiv = document.createElement("div");
                textDiv.className = `member_message_comment${i}`;
                let textP = document.createElement("p")
                let textNode = document.createTextNode(message_content);
                textP.appendChild(textNode);
                textDiv.appendChild(textP);
                visitorDiv.appendChild(textDiv);

                let comment_content = document.querySelector(`.member_message_comment${i}`);

                // 如果留言有圖片,則將照片放上去
                if (message_photo != null) {

                    let message_img = document.createElement("img");
                    message_img.className = "message_photo";
                    message_img.src = message_photo;
                    message_img.setAttribute("width", "100");
                    message_img.setAttribute("height", "80");
                    comment_content.appendChild(message_img);
                    

                }

                // 留言時間
                let dateDiv = document.createElement("div");
                dateDiv.className = "comment_date";
                let dateNode = document.createTextNode(date);
                dateDiv.appendChild(dateNode);
                visitorDiv.appendChild(dateDiv);

                let pHeight = textP.offsetHeight;
                let lineHeight = parseInt(window.getComputedStyle(textP).lineHeight);

                // 如果行數大於五行，加入 CSS 屬性
                if (pHeight > 5 * lineHeight) {
                    textP.style.display = '-webkit-box';
                    textP.style.boxOrient = "vertical";
                    textP.style.WebkitBoxOrient = "vertical";
                    textP.style.webkitLineClamp = '4';

                    // 建立展開按鈕
                    let expandBtn_content = document.querySelector(`.google_user_comment${i}`);
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
                } else {
                    // 
                }

            }

        })
}

function updateMember() {
    let updateButton = document.getElementById("update_button");
    updateButton.innerHTML = " ";
    let loading_img = document.createElement("img");
    loading_img.className = "loading_img";
    loading_img.src = "/static/image/loading.gif";
    loading_img.setAttribute("width", "30");
    loading_img.setAttribute("height", "30");
    updateButton.appendChild(loading_img);
    // 模擬更新時間
    setTimeout(function() {
        let nameElement = document.querySelector("#input_name");
        let name = nameElement.value;
        let emailElement = document.querySelector("#input_mail");
        let contact_email = emailElement.value;
        let phoneElement = document.querySelector("#input_phone");
        let phone = phoneElement.value;
        let birthdayElement = document.querySelector("#member_date");
        let birthday = birthdayElement.value;
        let maleElement = document.querySelector("#male");
        let male = maleElement.checked;
        let femaleElement = document.querySelector("#female");
        let female = femaleElement.checked;
        let genderResult = "";

        if (male == false & female == false) {
            genderResult = "";
        }
        if (male == true) {
            genderResult = "男生";
        }
        if (female == true) {
            genderResult = "女生";
        }

        
        let data = {
            name: name,
            contact_email: contact_email,
            phone: phone,
            birthday: birthday,
            gender: genderResult,
        };
       
        fetch("/api/member", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: new Headers({
                "content-type": "application/json"
            })
        })
        updateButton.innerHTML = "更新會員資料";
    }, 3000); 


}

fetch("/api/member", {
        method: "GET",
    })
    .then((response) => {

        return response.json();
    }).then((jsonData) => {
        
        let name = jsonData.name;
        let contact_email = jsonData.contact_email;
        let member_phone = jsonData.member_phone;
        let birthday = jsonData.birthday;
        let gender = jsonData.gender;
        let member_photo = jsonData.member_photo;
        
        document.querySelector("#input_name").value = name;
        document.querySelector("#input_mail").value = contact_email;
        document.querySelector("#input_phone").value = member_phone;
        document.querySelector("#member_date").value = birthday;

        let personImg = document.querySelector(".add_photo");
        if (member_photo !== null) {
            personImg.src = member_photo;
        } else {
            personImg.src = "/static/image/member_photo.png"
        }
        if (gender == "男生") {
            document.querySelector("#male").checked = true;
        }
        if (gender == "女生") {
            document.querySelector("#female").checked = true;
        }
    })


function closeMessage() {
    let element = document.querySelector(".overlay_message")
    element.style.display = "none";
}

function openMessage() {
    fetch("/api/user/auth", {
            method: "GET",
        })
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            if (jsonData.data == false) {
                
                openLogin();
            } else {
               
                let element = document.querySelector(".overlay_message")
                element.style.display = "block";
            }

        })

}

function update_Message() {
    console.log(messageId)
    let updateButton = document.getElementById("add_message");
    updateButton.innerHTML = " ";
    let loading_img = document.createElement("img");
    loading_img.className = "loading_img";
    loading_img.src = "/static/image/loading.gif";
    loading_img.setAttribute("width", "30");
    loading_img.setAttribute("height", "30");
    updateButton.appendChild(loading_img);
    // 模擬更新時間
    setTimeout(function() {

        const reviewTextarea = document.querySelector('.user-message-textarea');
        const submitBtn = document.querySelector('#add_message');
        const review = reviewTextarea.value;
        
        const formData = new FormData();
        formData.append('img', message_file);
        // 取得文字訊息
        content = document.querySelector(".user-message-textarea").value;
        formData.append('content', content);
        formData.append('restaurant_id', restaurant_id);
        formData.append('messageId', messageId);


        fetch("/api/update/messages", {
                method: 'POST',
                body: formData,
            })
            .then((response) => {
                return response.json();
            }).then((jsonData) => {
                window.location.href = `/member`;
            })
        updateButton.innerHTML = "送出評論";
    }, 2000); 

}

// 留言板的圖片預覽,點擊新增照片尚未上傳但可以在網頁預覽
function message() {
    // 留言板的圖片預覽
    const inputElement = document.querySelector('#input_message_img');

    inputElement.addEventListener('change', (e) => {
        message_file = e.target.files[0]; //获取图片资源
        

        if (!message_file.type.match('image.*')) {
            return false;
        }

        const reader = new FileReader();

        reader.readAsDataURL(message_file); // 读取文件

        // 渲染文件
        reader.onload = (arg) => {
            const previewBox = document.querySelector('.add_message_photo');
            previewBox.src = arg.target.result;
        }
    });

}