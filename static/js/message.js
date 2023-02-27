// 這是在餐廳頁面的js
let file="";
// 留言板的圖片預覽,點擊新增照片尚未上傳但可以在網頁預覽
function message(){
    // 留言板的圖片預覽
    const inputElement = document.querySelector('#img_input2');

    inputElement.addEventListener('change', (e) => {
    file = e.target.files[0]; //获取图片资源
    // console.log(file ,"file")

    // 只选择图片文件
    if (!file.type.match('image.*')) {
        return false;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file); // 读取文件

    // 渲染文件
    reader.onload = (arg) => {
        const previewBox = document.querySelector('.add_photo');    
        previewBox.src = arg.target.result;
    }
    });

}
// console.log(file,"外面的file")

// 開關註冊

function closeMessage() {
    let element = document.querySelector(".overlay_message")
    element.style.display = "none";
}
function openMessage() {
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
            //  如果有登入打開新增評論頁面
            let element = document.querySelector(".overlay_message")
            element.style.display = "block";
        }
        
    })
    
}

function update_Message(){
    // 抓取現在頁面的餐廳id
    let path = location.pathname;
    let parts = path.split("/");
    let restaurant_id = parts.pop();
    // console.log(restaurant_id,"store_id")

    // 抓取訊息內容
    const reviewTextarea = document.querySelector('.user-message-textarea');
    const submitBtn = document.querySelector('#add_message');

    // submitBtn.addEventListener('click', (event) => {
    // event.preventDefault();  // 防止表單預設提交行為

    const review = reviewTextarea.value;
    // console.log(review )
    // console.log(file)
    const formData = new FormData();
    formData.append('img', file);
    // 取得文字訊息
    content = document.querySelector(".user-message-textarea").value;
    formData.append('content', content);
    formData.append('restaurant_id', restaurant_id );

    
    fetch("/api/messages", {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        // 這裡會得到一個 ReadableStream 的物件
        // 可以透過 blob(), json(), text() 轉成可用的資訊
        return response.json();
    }).then((jsonData) => {
        // console.log(jsonData,"回傳")
        let content=document.querySelector(".donw_content")
        let contentDiv = document.createElement("div");
        contentDiv.className ="message";
        let textDiv = document.createElement("div");
        textDiv.className ="text";
        let textNode = document.createTextNode(jsonData.content);
        textDiv.appendChild(textNode);
        contentDiv.appendChild(textDiv);
        // content.prepend(contentDiv);


        let img = document.createElement("img");
        img.src = jsonData.photo;
        // 將圖片放在attraction_content容器下面
        contentDiv.appendChild(img);

        // 按下送出評論時重新整理頁面
        window.location.href=`/restaurant/${restaurant_id}`;
    })
   
}

