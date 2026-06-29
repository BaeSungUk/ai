/*
    모듈
    - 자바스크립트 모듈은 코드의 재사용성과 유지보수성을 높이기 위해 기능을 개별 파일로 분리하여 사용할 수 있도록 해주는 구조

    1. CommonJS 방식의 모듈

        // counter.js
        let count = 0   // 외부에서 직접 접근 불가
        function increase() {
            count++
        }
        function getCount() {
            return count
        }
        
        module.exports.getCount = getCount  // 외부에서 사용 가능
        module.exports.increase = increase  // 외부에서 사용 가능

        //main.js
        const counter = require("./counter")    // counter.js 파일을 불러옴

        counter.increase()
        console.log(counter.getCount())

    2. ES6 방식의 모듈
        // counter.mjs
        exprot function increases() {
            count++
        }
        exprot function getCount() {
            return count
        }

        //main.mjs
        import { increases, getCount} from "./counter.mjs"

        increases()
        console.log(getCount())

    라우트
    - 웹 애플리케이션에서 클라이언트가 요청한 URL 경로와 HTTP 메서드에 따라 서버가 어떤 동작을 수행할지를 정의하는 규칙

        app.route("/경로")
            .get((req, res) => {
                // get 요청 처리
            })
            .post ((req, res) => {
                // post 요청 처리    
            })
            .put ((req, res) => {
                // put 요청 처리    
            })
            .delete ((req, res) => {
                // delete 요청 처리    
            })

    status: 서버가 요청 결과를 어떤 상태로 처리했는지 알려주는 번호
        100대: 요청 처리 중(거의 사용 안함)
        200대: 성공
            200: 요청 성공
            201: 데이터 생성 성공
        300대: 다른 주소로 이동
            301: 주소 변경
            302: 임시로 변경
        400대: 사용자 요청 문제
            401: 로그인 필요
            403: 접근 금지
            404: 페이지 없음, 오류
        500대: 서버 문제
            500: 서버 오류
*/

import express from "express"
const app = express()

app.route("/posts")
    .get((req, res) => {
        // get 요청 처리
        res.status(200).send("/posts GET 호출")
    })
    .post ((req, res) => {
        // post 요청 처리    
        res.status(201).send("/posts POST 호출")
    })
    .put ((req, res) => {
        // put 요청 처리    
        res.status(201).send("/posts PUT 호출")
    })
    .delete ((req, res) => {
        // delete 요청 처리    
        res.status(200).send("/posts DELETE 호출")
    })

app.listen(3000, () => {
    console.log("서버 실행 중...")
})