[![Build Status](https://travis-ci.com/belldoor/humbahumbabot.svg?branch=master)](https://travis-ci.com/belldoor/humbahumbabot)

# 훔바훔바 봇
![teamwork-cat-dog](https://extmovie.com/files/attach/images/148/030/648/041/4cc6c42959c87f70cd54a33b8d1ee44b.gif)\
[킹갓제너럴뎀바바](https://namu.wiki/w/%EB%8E%80%EB%B0%94%20%EB%B0%94)의 충견 [스티븐 훔바훔바](https://namu.wiki/w/%EC%8A%A4%ED%8B%B0%EB%B8%90%20%EC%A0%9C%EB%9D%BC%EB%93%9C)가 긁어주는 해외축구 뉴스!


# How to
```
$ git clone https://github.com/belldoor/humbahumbabot.git
$ npm install
$ npm run dev
// 특정 일자에 게시된 인기 순 뉴스 긁어오기
$ curl -d {"date":"20200101"}' -X POST localhost:3000/
// 금일 날짜에 게시된 인기 순 뉴스 긁어오기
$ curl localhost:3000/
```


# Telegram 지원
![humbabot-image](https://user-images.githubusercontent.com/8427455/71658898-da549580-2d88-11ea-8ed5-664b500e990d.png)
* 텔레그램에서 훔바훔바(@HumbaHumbaBot) 친구 추가
* `/start`
* 리버풀의 대표 레전드 [스티븐 훔바훔바](https://namu.wiki/w/%EC%8A%A4%ED%8B%B0%EB%B8%90%20%EC%A0%9C%EB%9D%BC%EB%93%9C)가 매일 오전 8시에 네이버 해외 축구 인기 기사를 물어다줍니다!


# AWS Lambda vs 로컬에서 실행하기
* 훔바봇은 네이버 해외 축구 뉴스를 크롤링 하기 위해 크롬이 임베드 되어 있는 puppeteer를 사용합니다.
* 하지만 AWS Lambda에서는 업로드 용량이 제한되어 있기 때문에 puppeteer 대신 크롬 바이너리를 AWS Lambda Layer를 사용해서 사용합니다.
* 따라서 로컬에서 사용하기 위해 devDependency로 puppeteer를 설치해서 사용합니다.
* [Apex up](https://github.com/apex/up)을 이용해 AWS Lambda에 올려서 사용하기 위해 puppeteer-core chrome-aws-lambda를 production dependency로 설치합니다.
```
$ npm install puppeteer --save-dev // 로컬에서 사용
$ npm install puppeteer-core chrome-aws-lambda --save-prod // AWS Lambda에서 사용
```
* [참고](https://github.com/alixaxel/chrome-aws-lambda/wiki/HOWTO:-Local-Development)
