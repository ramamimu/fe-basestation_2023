FROM node:16.20.2

RUN mkdir -p /root/app
WORKDIR /root/app
COPY . /root/app
RUN node -v
RUN npm install
RUN ls -a /root/app
CMD [ "npm", "run", "refbox" ]

EXPOSE 3333
EXPOSE 5173