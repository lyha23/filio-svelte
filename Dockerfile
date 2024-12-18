# 使用官方Node.js的Docker镜像
FROM node:22-alpine3.19

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY . .

RUN rm -rf node_modules package-lock.json pnpm-lock.yaml
RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/

# 安装pnpm
RUN npm install -g pnpm

# 安装项目依赖
RUN pnpm install

# 构建项目
RUN pnpm run build

# 暴露3100端口
EXPOSE 3100

# 运行项目
CMD ["pnpm", "start"]
