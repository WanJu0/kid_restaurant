// 這是在餐廳頁面的js
let file="";
function message(){
    // 留言板的圖片預覽
    const inputElement = document.querySelector('#img_input2');

    inputElement.addEventListener('change', (e) => {
    file = e.target.files[0]; 
   
    if (!file.type.match('image.*')) {
        return false;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file); 
    reader.onload = (arg) => {
        const previewBox = document.querySelector('.add_photo');    
        previewBox.src = arg.target.result;
    }
    });

}

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
        }
        else{
            
            let element = document.querySelector(".overlay_message")
            element.style.display = "block";
        }
        
    })
    
}

function create_Message(){

    let updateButton = document.getElementById("add_message");
    updateButton.innerHTML = " ";
    let loading_img =document.createElement("img");
    loading_img.className ="loading_img";
    loading_img.src ="/static/image/loading.gif";
    loading_img.setAttribute("width", "30");
    loading_img.setAttribute("height", "30");
    updateButton.appendChild(loading_img);
    // 模擬更新時間
    setTimeout(function() {
        
    let path = location.pathname;
    let parts = path.split("/");
    let restaurant_id = parts.pop();
   
    const reviewTextarea = document.querySelector('.user-message-textarea');
    const submitBtn = document.querySelector('#add_message');


    const review = reviewTextarea.value;
    const formData = new FormData();
    formData.append('img', file);
    
    content = document.querySelector(".user-message-textarea").value;
    formData.append('content', content);
    formData.append('restaurant_id', restaurant_id );

    
    fetch("/api/messages", {
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        return response.json();
    }).then((jsonData) => {
        let content=document.querySelector(".donw_content")
        let contentDiv = document.createElement("div");
        contentDiv.className ="message";
        let textDiv = document.createElement("div");
        textDiv.className ="text";
        let textNode = document.createTextNode(jsonData.content);
        textDiv.appendChild(textNode);
        contentDiv.appendChild(textDiv);
        

        let img = document.createElement("img");
        img.src = jsonData.photo;
       
        contentDiv.appendChild(img);

        window.location.href=`/restaurant/${restaurant_id}`;
    })
        updateButton.innerHTML = originalText;
    }, 2000); 

}

