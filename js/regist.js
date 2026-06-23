window.onload = function(){
    const ssn1 = document.getElementById("ssn1")
    ssn1.addEventListener("keyup", () => {
        if(ssn1.value.length >= 6) {
            document.getElementById("ssn2").focus()
        }
    })

    const ssn = document.querySelectorAll(".ssn")
    ssn.forEach((s) => {
        // console.log(s)
        s.addEventListener("input", () => {
            document.getElementById("ssncheck").value = "n"
        })
    })
}


function sendit() {
    const userid = document.getElementById("userid")
    const userpw = document.getElementById("userpw")
    const userpw_re = document.getElementById("userpw_re")
    const name = document.getElementById("name")
    const hp = document.getElementById("hp")
    const email = document.getElementById("email")
    const ssncheck = document.getElementById("ssncheck")

    // 정규식은 다 붙혀서 써야하고, 대문자, 소문자, 숫자다 사용 가능하고 4~20자로 아이디 생성 가능
    const expIdText = /^[A-Za-z0-9]{4,20}$/
    /*
        (?=.*): 어디엔가 원하는 패턴이 하나라도 있어야 함
        (?=.*[A-Za-z]): 영문자가 최소 1개 이상 있어야 함
        (?=.*\d): 숫자가 최소 1개 이상 있어야 함
        (?=.*[!@#$%^&*()]): 제시된 특수문자가 최소 1개 이상 있어야 함

    */
    const expPwText = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/
    const expNameText = /^[가-힣A-Za-z]{2,}/
    const expHpText = /^\d{3}-\d{3,4}-\d{4}$/
    const expEmailText = /^[A-Za-z0-9\-\.]+@[A-Za-z0-9\-]+\.[A-Za-z]+$/ 

    if(userid.value === "") {
        alert("아이디를 입력하세요")
        userid.focus()
        return false
    }

    if(!expIdText.test(userid.value)){
        alert("아이디는 4자이상 20이하의 영문자 또는 숫자로 입력하세요")
        userid.focus()
        return false
    }

    if(!expPwText.test(userpw.value)){
        alert("비밀번호는 8자이상 20자이하의 영문자, 숫자, 특수문자를 한 자이상 꼭 포함해야함니다")
        userpw.focus()
        return false        
    }

    if(userpw.value != userpw_re.value) {
        alert("비밀번화와 비밀번호 확인이 일치하지 않습니다.")
        userpw_re.focus()
        return false         
    }

    if(!expNameText.test(name.value)) {
        alert("이름은 영문자 또는 한글로 2자 이상 입력하세요")
        name.focus()
        return false
    }

    if(!expHpText.test(hp.value)) {
        alert("핸드폰번호는 xxx-xxxx-xxxx형식에 맞게 입력하세요.")
        hp.focus()
        return false
    }

    if(!expEmailText.test(email.value)) {
        alert("이메일형식에 맞게 입력하세요")
        email.focus()
        return false
    }

    if(ssncheck.value == "n") {
        alert("주민등록번호 검증 버튼을 눌러주세요")
        return false
    }
}
/*
    주민등록번호 유효성 체크
    여기에 자신 주민번호를 맞춰서 각 자리마다 곱하고
    0 0 1 0 1 1 3 0 6 8 5 1     8
    2 3 4 5 6 7 8 9 2 3 4 5 
 
    다 곱한 값을 다 더한 수에서 나머지를 구하고 
    102 % 11 = 3

    11로 나온수를 빼고 나온수랑 맨 뒷자리랑 같으면 인증된 주민번호 
    11 - 3 = 8 (단 값이 10이상일 경우 10으로 나눈 나머지 값을 구함 0 또는 1)
    
    

 */
function checkSsn(){
    let ssncheck = document.getElementById("ssncheck")
    const ssn1 = document.getElementById("ssn1")
    const ssn2 = document.getElementById("ssn2")
    const ssn = ssn1.value + ssn2.value
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
    let result = 0
    
    for(i=0; i<weights.length; i++) {
        result += parseInt(ssn[i] * weights[i])
    }

    result = (11 - result % 11 ) % 10

    if(result == parseInt(ssn[12])) {
        alert("유효한 주민등록번호 입니다!")
        ssncheck.value = "y"
    } else {
        alert("유효하지 않은 주민등록 번호 입니다!")
        ssncheck.value = "n"
        ssn1.focus()
        return false
    }
}