FROM python:latest

# 這邊是執行檔案的路徑嗎？？？
# 定義當前的目錄位置
WORKDIR /app

COPY requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .
ENTRYPOINT ["python3"]
CMD ["app.py"]
