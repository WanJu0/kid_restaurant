// 進入頁面要先確認資料庫是否有我的最愛,有的話要顯示紅愛心
let path = location.pathname;
let parts = path.split("/");
let restaurant_id = parts.pop();
console.log(restaurant_id,"2222")
fetch(`/api/favorites/${restaurant_id}`,{
    method: "GET",
})
.then((response)=>{
    return response.json();
}).then((jsonData)=>{
    // console.log(jsonData);
    // console.log(jsonData.love);

    if(jsonData.love == true ){
        let favoriteElement = document.querySelector(".favorite_button");
        let unfavoriteElement = document.querySelector(".redLove_button");
        unfavoriteElement.style.display ="flex";
        favoriteElement.style.display = "none";
    }
})

function myfavorite(){

    let path = location.pathname;
    let parts = path.split("/");
    let restaurant_id = parts.pop();
    // console.log(restaurant_id)

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
            // .then(function(response){
            //     if(response.status ==400){
            //         document.getElementById("error_message").innerHTML = "請選擇日期和時間"
            //         return ;
            //     }
            //     if(response.status ==200){
            //         response.json().then(function(data){
            //             window.location.href="/booking";
            //         })
            //     }
            // })
        }
        
    })
}



function unfavorite(){
    let favoriteElement = document.querySelector(".favorite_button");
    let unfavoriteElement = document.querySelector(".redLove_button");
    favoriteElement.style.display = "flex";
    unfavoriteElement.style.display ="none";

    let data=
        {
            restaurant_id:restaurant_id
        };
    console.log(data,"要傳的資料")
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