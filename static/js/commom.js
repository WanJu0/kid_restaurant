// 點擊或關閉註冊和登入div
function openLogin() {
    let element = document.getElementById("overlay_login")
    element.style.display = "block";
}
function closeLogin() {
    let element = document.getElementById("overlay_login")
    element.style.display = "none"
} 
// 開關註冊
function openSignup() {
    let element = document.getElementById("overlay_signup")
    element.style.display = "block";
}
function closeSignup() {
    let element = document.getElementById("overlay_signup")
    element.style.display = "none";
} 
// 點擊打開右側會員登入側這下拉畫框
function openHamburger() {
    fetch("/api/user/auth", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((jsonData) => {
        let loginElement = document.querySelector(".right_content");
        let logoutElement = document.querySelector(".right_logout");
        console.log(jsonData.data, "登入這");
        if (jsonData.data == false) {
          if (loginElement.style.display === "block") {
            loginElement.style.display = "none";
          } else {
            loginElement.style.display = "block";
          }
          logoutElement.style.display = "none";
        } else {
          if (logoutElement.style.display === "block") {
            logoutElement.style.display = "none";
          } else {
            logoutElement.style.display = "block";
          }
          loginElement.style.display = "none";
        }
         // 新增事件監聽器以關閉 right_logout 元素的顯示
      document.addEventListener("click", function(e) {
        if (!logoutElement.contains(e.target) && !e.target.matches(".fa-bars")) {
          logoutElement.style.display = "none";
        }
        if (!loginElement.contains(e.target) && !e.target.matches(".fa-bars")) {
            loginElement.style.display = "none";
          }
      });
      });
  }
  
// 註冊系統
function apiSingup(){
    const nameElement = document.getElementById("input_signup_name");
    const name = nameElement.value;
    const emailElement = document.getElementById("input_signup_email");
    const email = emailElement.value;
    const passwordElement = document.getElementById("input_signup_password");
    const password = passwordElement.value;
    let data=
        {
            name:name,
            email:email,
            password:password
        };
        
    fetch("/api/user",{
        method: "POST" ,
        credentials: "include",
        body:JSON.stringify(data),
        cache:"no-cache",
        headers:new Headers({
            "content-type":"application/json"
        })
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
       
        if(jsonData.error==true){
            document.getElementById("signup_message").innerHTML = jsonData.message ;
        }
        if(jsonData.ok==true){
            document.getElementById("signup_message").innerHTML = "註冊成功" ;
            document.getElementById("login_btn").style.margin="0px";

        }
    })
}

// 登入系統的js 
function apiSingin()
{
    const emailElement = document.getElementById("input_email");
    const email = emailElement.value;
    const passwordElement = document.getElementById("input_password");
    const password = passwordElement.value;

    let data=
        {
            email:email,
            password:password
        };
   
    fetch("/api/user/auth",{
        method: "PUT" ,
        credentials: "include",
        body:JSON.stringify(data),
        cache:"no-cache",
        headers:new Headers({
            "content-type":"application/json"
        })
    })
    .then(function(response){
        if(response.status ==400){
            document.getElementById("signin_message").innerHTML = "帳號密碼有誤"
            return ;
        }
        if(response.status ==200){
            response.json().then(function(data){
                window.location.replace(location.href)
            })
        }

    })
    
}
// 寫一個函式可以判斷使用者是否有登入
let bookingName="";
let bookingEmail="";
function check()
{
    fetch("/api/user/auth",{
        method: "GET" ,
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        
        bookingName=jsonData.data.name
        bookingEmail=jsonData.data.email
        
        if(jsonData.data!=false){
            let element = document.querySelector(".right_login")
            element.style.display="none"
            let signoutElement = document.querySelector(".right_logout")
            signoutElement.style.display="block"
            signoutElement.style.display="flex"

        }
        else{
            let element = document.querySelector(".right_login")
            element.style.display="block"
            element.style.display="flex"
            let signoutElement = document.querySelector(".right_logout")
            signoutElement.style.display="none"
            
        }
        
    })
}

function logout()
{
    fetch("/api/user/auth",{
        method: "DELETE" ,
    })
    .then((response) => {
        return response.json(); 
    }).then((jsonData) => {
        window.location.replace(location.href)
        
    })
}
