/*
	문자열 함수, 수학 함수, 날짜 함수, 조건 함수, 형변환 함수, 집계 함수
*/
use ai;
-- 문자열 함수
-- concat() 문자열을 이어 붙이는 함수
select concat('안녕하세요', 'MySQL');
select concat(address1, ' ', address2, ' ', address3) as  주소 from member;

-- left(), right() 문자열의 왼쪽/오른쪽 일부를 가져옴
select left('abcdefghij', 3);
select right('abcdefghij', 4);
select userid, left(userid, 3) as '아이디일부분' from member;

-- substring() 문자열의 일부를 추출
select substring('abcdefghij', 3, 4); -- 3번째 문자부터 4글자 추출
select ssn1, substring(ssn1, 1, 2) as 출생년도 from member;

-- char_length(), length() 문자 개수, 바이트 수
select char_length('가나다'); 
select length('가나다'); -- 한글 3byte

-- trim(), ltrim(), rteim() 공백 제거
select trim('     mysql     ');
select ltrim('     mysql     ');
select rtrim('     mysql     ');

-- replace() 문자열 치환
select replace('010-1111-1111', '-', '');
select hp, replace(hp, '-', '') as 번호 from member;

-- lower(), upper() 소문자, 대문자 변환
select upper('mysql');
select email, upper(email) as 대문자 from member;




-- 수학 함수
-- abs() 절대값
select abs(-100);

-- round() 반올림
select round(3.141592, 3); -- 자리수 

-- ceil(), floor() 올림, 내림
select ceil(3.1);
select floor(3.9);

-- mod() 나머지 
select mod(10, 3);

-- rand() 랜덤값 생성(0~1사이의 실수)
select rand();
select * from member order by rand() limit 1;

-- truncate() 버림
select truncate(3.141592, 4);



-- 날짜함수 
-- now() 현재 날짜 + 시간
select now();

-- curdate(), curtime()
-- 컴퓨터에 저장된 날짜 시간 영향
select curdate(); -- 날짜
select curtime(); -- 시간

-- date_format() 날짜 포멧 변경
-- Y 4자리, y 2자리, H 오후, h 오전
select date_format(now(), '%Y년 %m월 %d일 %H시 %i분 %s초');

-- datediff() 날짜 차이 계산
select datediff('2026-12-17', now());

-- adddate() 날짜 더하기
select adddate(now(), 30);

-- subdate() 날짜 빼기
select subdate(now(), 7);

-- dayofweek() 요일 숫자 반환 1: 일요일, 2: 월요일 .....
select dayofweek(now());

-- month(), year(), day()
select year(now());
select month(now());
select day(now());




-- 조건 함수
-- if() 조건 처리
select userid, if(point >=300, 'VIP', '일반') from member;

-- ifnull() null인지 확인, null처리
select ifnull(regdate, '가입일 없음') from member;

-- nullif() 두값이 같으면 null 반환
select nullif(20, 20);

-- case when 여러조건 처리
select userid,
case
	when point >=200 then 'VIP'
	when point >=100 then 'Gold'
	else 'Normal'
end as 등급 from member;




-- 형변환 함수
-- cast() 자료형 변경
select cast('2026-06-08' as datetime);

-- convert() 형변환
select convert('-123', signed);
select convert('-123', unsigned); -- 부호비트를 안쓴 값이 나옴.




-- 집계 함수
-- count() 행 개수
select count(idx) from member; -- null 값은 세지 않는다.

-- avg() 평균
select avg(point) from member;

-- sum() 합계
select sum(point) from member;

-- max(), min() 최댓값 / 최솟값
select max(point) from member;
select min(point) from member;




select userid, left(userid,3) from member;

select hp, replace(hp, '-', '') from member;

select date_format(now(), '%Y/%m/%d');

select avg(point) from member;

select max(point) from member;

select case
		when point >= 200 then 'VIP'
        when point >= 200 then 'Gold'
        else 'Normal' end as 등급
from member;

select name from member order by rand() limit 1;

select length(email) from member;

select regdate, datediff(now(), regdate) from member;



update member set regdate = null where idx = 5;
select * from member;

