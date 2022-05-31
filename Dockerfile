FROM node:14.17.6
WORKDIR /
COPY package.json ./
RUN npm install
COPY . /
CMD ["npm","start"]