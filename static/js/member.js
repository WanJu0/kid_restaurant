function update_photo(){
    const inputElement = document.querySelector('#img_input2');
    inputElement.addEventListener('change', (e) => {
    let file = e.target.files[0]; //取得檔案資訊
    // 创建一个包含原文件内容的 Blob
    const fileBlob = new Blob([file], { type: file.type });

    // 將名字改成想要的名稱,這邊用id來命名
    const newFile = new File([fileBlob], `${user_id}.jpg`, { type: file.type });
    
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
    
    const formData = new FormData();
    const a=formData.append('img', newFile);
    // fetch("/api/images", {
    //     method: 'POST',
    //     body: formData,
    // })
    // .then((response) => {
    //     // 這裡會得到一個 ReadableStream 的物件
    //     // 可以透過 blob(), json(), text() 轉成可用的資訊
    //     return response.json();
    // }).then((jsonData) => {
      
    // })
});
}