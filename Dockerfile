FROM node

WORKDIR /interior-and-exterior/server

COPY ./package.josn .

RUN npm install --production

COPY ./build ./build
COPY ./.env.prod ./.env

RUN ls

ENV NODE_ENV production

EXPOSE 5000

CMD ["node", "build/index.js"]

# docker build -t bartoszstolc/interior-and-exterior:1.0.0 .
# docker build --no-cache -t bartoszstolc/interior-and-exterior:1.0.0 . // rebuild
# docker run -it bartoszstolc/interior-and-exterior:1.0.0 sh
# docker run -p 5000:5000 --net="host" bartoszstolc/interior-and-exterior:1.0.0 // when localhost
# docker run -p 5000:5000 bartoszstolc/interior-and-exterior:1.0.0 // when remote host

# docker ps
# docker stop <container id>