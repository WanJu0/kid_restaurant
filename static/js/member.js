let member_id="";
let member_name="";
let store_id_list=[];
// 進到member頁面時判斷是否有登入
fetch("/api/user/auth", {
    method: "GET",
})
.then((response) => {
    return response.json();
}).then((jsonData) => {
    if (jsonData.data == false) {
        window.location.href = "/"
    }
    else{
        member_id=jsonData.data["id"]; 
        member_name=jsonData.data["name"]; 
        const member_email=jsonData.data["email"]; 
        document.getElementById("input_name").value = member_name;
        document.getElementById("input_mail").value = member_email;
        myMessage()
    }
    
})

// 再點選大頭照那邊再選擇完照片後直接上傳更新
function update_member_photo(){
    const inputElement = document.querySelector('#img_input2');
    inputElement.addEventListener('change', (e) => {
    let file = e.target.files[0]; //取得檔案資訊
    // 创建一个包含原文件内容的 Blob
    const fileBlob = new Blob([file], { type: file.type });

    // console.log(member_id,"選擇照片時看user id是誰")
    // 將名字改成想要的名稱,這邊用id來命名
    const originalFileName = file.name; // 获取原始文件名
    const newFileName = `${member_id}.${file.type.split('/')[1]}`; // 将扩展名替换为 file.type 的后缀名
    const newFile = new File([fileBlob], newFileName, { type: file.type });
    // console.log(member_id,"function李")
    // console.log(originalFileName,"originalFileName")
    // console.log(newFileName,"newFileNam")
    if (!file.type.match('image.*')) {
        return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file); // 读取文件
    // console.log(file.type ,"file.type ")
   
    // 渲染文件
    reader.onload = (arg) => {
    const previewBox = document.querySelector('.add_photo');    
    previewBox.src = arg.target.result;
    }
    
    const formData = new FormData();
    const a=formData.append('img', newFile);
    fetch("/api/member/photo", {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        // 這裡會得到一個 ReadableStream 的物件
        // 可以透過 blob(), json(), text() 轉成可用的資訊
        return response.json();
    }).then((jsonData) => {
        // console.log(jsonData,"大頭照回傳值")

      
    })
});
}
// 看使用者是否有照片有的話就顯示沒有就是預設圖片
// fetch("/api/member/photo", {
//     method: 'GET',
// })
// .then((response) => {
//     // 這裡會得到一個 ReadableStream 的物件
//     // 可以透過 blob(), json(), text() 轉成可用的資訊
//     return response.json();
// }).then((jsonData) => {
//     // console.log(jsonData,"照片")
//     // console.log(jsonData.image,"照片")
//     let personImg = document.querySelector(".add_photo");
//     if (jsonData.image!==null){
//         personImg.src =jsonData.image;
//     }
//     else{
//         personImg.src ="/static/image/member_photo.png"
//     }
// })

// 顯示所有我收藏的餐廳資訊
function myFavorite(){
    fetch("/api/favorites",{})
    .then((response) =>{
        return response.json();
    }).then((jsonData)=>{
        // console.log(jsonData.data,"我的最愛");
        for (let i =0; i< jsonData.data.length; i++){

            let store_id= jsonData.data[i].favorite_restaurant_id;;
            let address = jsonData.data[i].address;
            let straddress = address.split('台灣');
            let content = document.querySelector(".favorite_down");
            //新增一個連結在最外層
            let restaurantLink = document.createElement("a");
            store_id_list.push(store_id);
            // console.log(store_id,"oooooo")
            // console.log(store_id_list,"aaaaaa")
            restaurantLink.className = `restaurant_link${i}`;
            restaurantLink.href=`/restaurant/${jsonData.data[i].favorite_restaurant_id}`;
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
            prodcut_redlove.setAttribute("onclick","event.preventDefault(); member_unfavorite(this.id);" )
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

    })
}

myFavorite();

// 顯示我所有的評論
function myMessage(){
    fetch(`/api/messages/${member_id}`, {})
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        console.log(jsonData.data,"所有評論")
        for (let i =0; i< jsonData.data.length; i++){
            let user_id = jsonData.data[i].user_id;
            let message_content =jsonData.data[i].message_content;
            let message_photo = jsonData.data[i].message_photo;
            let user_photo =jsonData.data[i].user_photo
            let date = jsonData.data[0].date.substring(0, 10)

            let content = document.querySelector(".comment_content");
            let googleDiv = document.createElement("div");
            googleDiv.className = `member_comment${i}`;
            content.appendChild(googleDiv);

            // 建立google_information
            let google_information_content =document.querySelector(`.member_comment${i}`);
            let informationDiv = document.createElement("div");
            informationDiv.className = `message_information${i}`;
            // googleDiv.appendChild(informationDiv);


            // information 底下建立 user_img和 user
            let user_img =document.createElement("img");
            user_img.className ="member_photo";
            
            if (user_photo!==null){
                user_img.src = user_photo;
            }
            else{
                user_img.src ="/static/image/member.png"
            }
           
            user_img.setAttribute("width", "40");
            user_img.setAttribute("height", "40");
            informationDiv.appendChild(user_img);
            googleDiv.appendChild(informationDiv);
            // content.appendChild(informationDiv);

            let userDiv = document.createElement("div");
            userDiv.className = "member_name";
            let userNode = document.createTextNode(member_name);
            userDiv.appendChild(userNode);
            informationDiv.appendChild(userDiv);
            googleDiv.appendChild(informationDiv);

            //修改符號
            // let modifyDiv = document.createElement("div");
            // modifyDiv.className = "dot_div";
            let modify_img =document.createElement("img");
            modify_img.className ="dot_photo";
            modify_img.src ="/static/image/dot_2.png"
            modify_img.setAttribute("width", "20");
            modify_img.setAttribute("height", "20");
            // modifyDiv.appendChild(modify_img);
            informationDiv.appendChild(modify_img);
            googleDiv.appendChild(informationDiv);

           
            // 評論內容
            let textDiv = document.createElement("div");
            textDiv.className = `member_message_comment${i}`;
            let textP = document.createElement("p")
            let textNode = document.createTextNode(message_content);
            textP.appendChild(textNode);
            textDiv.appendChild(textP);
            googleDiv.appendChild(textDiv);

            let comment_content =document.querySelector(`.member_message_comment${i}`);

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

            // let content = document.querySelector(".comment_content");
            // let visitorDiv = document.createElement("div");
            // visitorDiv.className = `visitor_comment${i}`;
            // content.appendChild(visitorDiv);

            // // 建立comment_photo_div
            // let visitor_comment_content =document.querySelector(`.visitor_comment${i}`);
            // let comment_photoDiv = document.createElement("div");
            // comment_photoDiv.className = `comment_photo_div${i}`;
            

            // let comment_img =document.createElement("img");
            // comment_img.className ="comment_photo";
            // comment_img.src = message_photo;
            // comment_photoDiv.appendChild(comment_img);
            // visitor_comment_content.appendChild(comment_photoDiv);

            // // 建立member_information
            // let member_informationDiv = document.createElement("div");
            // member_informationDiv.className = `member_information${i}`;
            // visitor_comment_content .appendChild(member_informationDiv);

            // // information 底下建立 user_img和 user
            // let user_img =document.createElement("img");
            // user_img.className ="member_icon";
            // user_img.src = user_photo;
            // user_img.setAttribute("width", "40");
            // user_img.setAttribute("height", "40");
            // member_informationDiv.appendChild(user_img);
            // visitor_comment_content .appendChild(member_informationDiv);
            
            // let userDiv = document.createElement("div");
            // userDiv.className = "visitor_name";
            // let userNode = document.createTextNode("還缺名字");
            // userDiv.appendChild(userNode);
            // member_informationDiv.appendChild(userDiv);
            // visitor_comment_content .appendChild(member_informationDiv);
            
            // // user_comment
            // let user_commentDiv = document.createElement("div");
            // user_commentDiv.className = "user_comment";
            // let user_commentDivNode = document.createTextNode(message_content);
            // user_commentDiv.appendChild(user_commentDivNode);
            // visitor_comment_content.appendChild(user_commentDiv);
            
            // // comment_date
            // let dateDiv = document.createElement("div");
            // dateDiv.className = "comment_date";
            // let dateNode = document.createTextNode(date);
            // dateDiv.appendChild(dateNode);
            // visitor_comment_content.appendChild(dateDiv);
        }
    })
}

function updateMember(){
    let updateButton = document.getElementById("update_button");
    updateButton.innerHTML = " ";
    let loading_img =document.createElement("img");
    loading_img.className ="loading_img";
    loading_img.src ="/static/image/loading.gif";
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
    let maleElement= document.querySelector("#male") ;
    let male= maleElement.checked ;
    let femaleElement = document.querySelector("#female") ;
    let female= femaleElement.checked ;
    let genderResult="";
    // console.log(name);
    // console.log(email);
    // console.log(phone);
    // console.log(birthday);
    // console.log(emergencyName);
    // console.log(emergencyPhone);
    if(male==false & female==false){
        genderResult="";
    }
    if(male==true){
        genderResult="男生";
    }
    if(female==true){
        genderResult="女生";
    }
    
    // 將輸入的資訊更新到資料庫中
    let data=
        {
            name:name,
            contact_email:contact_email,
            phone:phone,
            birthday:birthday,
            gender:genderResult,
        };
    // console.log(data)
    fetch("/api/member",{
        method:"POST",
        credentials:"include",
        body:JSON.stringify(data),
        headers:new Headers({
            "content-type":"application/json"
        })
    })
        updateButton.innerHTML = "更新會員資料";
    }, 3000); // 這裡的 3000 毫秒代表模擬更新需要的時間，可以依照實際情況進行調整
        
    
}

fetch("/api/member", {
    method: "GET",
})
.then((response) => {
    // 這裡會得到一個 ReadableStream 的物件
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.json();
}).then((jsonData) => {
    console.log(jsonData)
    let name=jsonData.name;
    let contact_email=jsonData.contact_email;
    let member_phone=jsonData.member_phone;
    let birthday=jsonData.birthday;
    let gender=jsonData.gender;
    let member_photo=jsonData.member_photo;
    // user_id=jsonData.data["id"];
    // // 將基本資訊自動填入
    document.querySelector("#input_name").value = name;
    document.querySelector("#input_mail").value = contact_email;
    document.querySelector("#input_phone").value = member_phone;
    document.querySelector("#member_date").value = birthday;

    let personImg = document.querySelector(".add_photo");
    if (member_photo!==null){
        personImg.src =member_photo;
    }
    else{
        personImg.src ="/static/image/member_photo.png"
    }
    if(gender=="男生"){
        document.querySelector("#male").checked=true;
    }
    if(gender=="女生"){
        document.querySelector("#female").checked=true;
    }
})


