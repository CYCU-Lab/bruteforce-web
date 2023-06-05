# 使用官方的Node.js映像作為基礎
FROM node:14

# 設定工作目錄
WORKDIR /app

# 複製專案檔案到容器中
#COPY package.json package-lock.json /app/
COPY package.json /app/

# 安裝相依套件
RUN npm install

# 複製應用程式代碼到容器中
COPY . /app

# 定義容器的執行命令
CMD ["node", "app.js"]
