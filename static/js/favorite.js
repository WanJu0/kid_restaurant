// 進入頁面要先確認資料庫是否有我的最愛,有的話要顯示紅愛心
let path = location.pathname;
let parts = path.split("/");
let restaurant_id = parts.pop();
// console.log(restaurant_id,"2222")
fetch(`/api/favorites/${restaurant_id}`,{
    method: "GET",
})
.then((response)=>{
    return response.json();
}).then((jsonData)=>{
    if(jsonData.love == true ){
        let favoriteElement = document.querySelector(".favorite_button");
        let unfavoriteElement = document.querySelector(".redLove_button");
        unfavoriteElement.style.display ="flex";
        favoriteElement.style.display = "none";
    }
})

// 這個是餐廳頁面的新增愛心
function myfavorite(){

    let path = location.pathname;
    let parts = path.split("/");
    let restaurant_id = parts.pop();
    // console.log(restaurant_id)

    fetch("/api/user/auth", {
        method: "GET",
    })
    .then((response) => {
        return response.json();
    }).then((jsonData) => {
        if (jsonData.data == false) {
            // 打開註冊頁面
            openLogin();
        }
        else{
            let favoriteElement = document.querySelector(".favorite_button");
            let unfavoriteElement = document.querySelector(".redLove_button");
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


// 這個是餐廳頁面的取消愛心
function unfavorite(){
    let favoriteElement = document.querySelector(".favorite_button");
    let unfavoriteElement = document.querySelector(".redLove_button");
    favoriteElement.style.display = "flex";
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

function member_unfavorite(redbuttonId){
    // console.log(redbuttonId);
    let parts = redbuttonId.split("love");
    let restaurant_id = parts.pop();
    // console.log(restaurant_id,"restaurant_id");
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
         
    }).then(response => {
        // 刪除成功後重新整理頁面
        window.location.href="/member";
    });

   
}

