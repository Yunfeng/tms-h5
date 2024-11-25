# 基础镜像
FROM node:22.11.0

# 选择工作目录
WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# 暴露容器端口
EXPOSE 8090

# 运行Spring Boot应用
CMD ["npm", "run", "dev"]