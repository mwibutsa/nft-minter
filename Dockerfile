FROM node:16.17-alpine

ARG NEXT_PUBLIC_ALCHEMY_API_KEY
ARG NEXT_PUBLIC_DEFAULT_CHAIN
ARG NEXT_PUBLIC_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_PRIVATE_KEY=
ARG NEXT_PUBLIC_PINATA_API_KEY
ARG NEXT_PUBLIC_PINATA_API_SECRET

ENV NEXT_PUBLIC_ALCHEMY_API_KEY=$NEXT_PUBLIC_ALCHEMY_API_KEY
ENV NEXT_PUBLIC_DEFAULT_CHAIN=$NEXT_PUBLIC_DEFAULT_CHAIN
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=$NEXT_PUBLIC_CONTRACT_ADDRESS
ENV NEXT_PUBLIC_PRIVATE_KEY=$NEXT_PUBLIC_PRIVATE_KEY
ENV NEXT_PUBLIC_PINATA_API_KEY=$NEXT_PUBLIC_PINATA_API_KEY
ENV NEXT_PUBLIC_PINATA_API_SECRET=$NEXT_PUBLIC_PINATA_API_SECRET

RUN apk add --no-cache git build-base openssh
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /app

EXPOSE 3000
ADD frontend .

RUN npm install --legacy-peer-deps --verbose
RUN npm run build

CMD npm run start
