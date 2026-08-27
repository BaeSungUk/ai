/*
	DML(Data Mamipulation Language, 데이터 조작어)
    select: 데이터를 조회(검색)
    insert: 데이터를 테이블에 삽입
    update: 데이터를 수정
    delete: 데이터를 삭제
*/

create table voca (
	eng varchar(50) primary key,
    kor varchar(50) not null,
    lev int default 1,
    regdate datetime default now()
);
use ai;
desc voca;

-- SQL에서는 문자열을 '' 작은따움표로만 사용
-- insert into 테이블 values () 에서는 모든 컬럼을 다 넣어줘야 한다.
insert into voca values (
	'apple', '사과', 1, now()
) ;

-- 맨처음 use ai를 하지 않으면 이런 에러가 발생
-- Error Code: 1046. No database selected Select the default DB to be used by double-clicking its name in the SCHEMAS list in the sidebar.
select * from voca;

 -- insert into 테이블(컬럼1,컬럼2) values(값1, 값2)
insert into voca(eng, kor) values('banana', '바나나');

-- Error Code: 1062. Duplicate entry 'melon' for key 'voca.PRIMARY'
insert into voca(eng, kor) values('orange',  '오렌지');
insert into voca(eng, kor) values('melon',  '멜론');
insert into voca(eng, kor, lev) values('avocado',  '아보카도', 2);


-- delete는 truncate랑 다르게 롤백이 가능
delete from member;
-- where 절 뒤에는 index, primarykey를 이용해서 사용하면 더 빠르다.
-- SQL에서 where절 뒤에 "="는 같다는 표현, 앞쪽에 "="는 사용하면 대입 
delete from voca where eng = 'banana';

-- update 테이블 set
update voca set lev=1;
update voca set lev=2 where eng = 'avocado';

-- 데이터가 있을경우 not null인데 null이되니까 그때 어떻게 해야할지 생각해야함.
alter table member add gender varchar(10) not null;

-- 회원가입
-- idx 컬럼 때문에 values문법을 사용할수 없다(idx에는 auto_increment가 걸려있기 때문)
-- 처음에 컬럼 순서랑 values 순서는 같아야한다. 테이블 컬럼 순서는 상관없다.
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender) values ('apple', '1111', '김사과', '010-1111-1111', 'apple@apple.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '여자');
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender) values ('banana', '2222', '반하나', '010-2222-2222', 'banana@banana.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '여자');
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender) values ('orange', '3333', '오렌지', '010-3333-3333', 'orange@orange.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '남자');
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender) values ('melon', '4444', '이메론', '010-4444-4444', 'melon@melon.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '남자');
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender) values ('cherry', '5555', '채리', '010-5555-5555', 'cherry@cherry.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '여자');
insert into member (userid, userpw, name, hp, email, ssn1, ssn2, zipcode, address1, address2, address3, gender, regdate) values ('berry', '6666', '베애리', '010-6666-6666', 'berry@berry.com', '001011', '4011111', '12345', '서울 서초구', '양재동', '111-11', '여자', null);

update member set point = 0 where idx = 5;
update member set point = point + 50 ;
update member set point = point + 100 where idx = 2;
-- update member set point = point + 100 where userid = 'banana';

use ai;
select * from member;
select userid, name from member;
select hp, userid, name  from member;

select 100;
select 100 + 50;
select 100 + 50 as 덧셈;
select 100 + 50 as '덧셈 연산';
select ''; -- 빈 문자열
select null; -- 데이터가 없음
select 100 + '';
select 100 + null; -- null과의 연산은 무조건 null이다.

/*
	산술 연산자: +, -, *, /, mod(나머지),div(몫) 
    비교 연산자: =, <, >, <=, >=, <>(다르다)
    대입 연산자: = 
    논리 연산자: and, or, not, xor
    is 연산자 : 양쪽의 피연산자가 모두 같은면 true, 아니면 false
    between A and B: A 보다는 크거나 같고, B 보다는 작거나 같으면 true, 아니면 false
    in : 매개변수로 전달된 리스트에 값이 존재하면 true 아니면 false
    like : 패턴으로 문자열을 검색하여 값이 존재하면 true 아니면 false
*/
-- 포인트가 150이상인 멤버의 아이디, 이름, 포인트를 검색
select userid, name, point from member where point >= 150;

-- 포인드가 150이상이고, 200이하인 멤버의 아이디, 이름, 포인트, 성별을 검색
select userid, name, point, gender from member where point >= 150 and point <= 200;
select userid, name, point, gender from member where point between 150 and 200;

-- 로그인
select userid from member where userid='apple' and userpw='1111'; -- 성공
select userid from member where userid='apple' and userpw='2222'; -- 실패

-- 이름이 김사과, 반하나, 오렌지인 사람의 모든 정보를 검색
select * from member where name='김사과' or name='반하나' or name='오렌지';
select * from member where name in ('김사과', '반하나', '오렌지');

-- regdate가 null인 멤버를 검색 null값을 찾을때는 is null, is not null로 사용
select * from member where regdate is null;


-- 아이디가 a로 시작하는 멤버의 정보를 검색
select * from member where userid like 'a%';
-- 아이디가 a로 끝나는 멤버의 정보를 검색
select * from member where userid like '%a';
-- 아이디가 a를 포함하는 멤버의 정보를 검색
select * from member where userid like '%a%';
-- 이메일이 '.com'으로 끝나는 멤버의 정보를 검색
select * from member where email like '%.com';
-- 이름이 3자인 멤버를 검색
select * from member where name like '___';
-- 이름이 첫 글자가 '김'씨이며 3자인 멤버를 검색
select * from member where name like '김__';


-- 정렬
select * from member order by idx; --  오름차순 asc 생략
select * from member order by idx desc; -- 내림차순 desc
-- 멤버를 포인트 순으로 정렬
select * from member order by point desc ;
-- 멤버를 포인트 순으로 정렬. 단 포인트가 같으면 가입 최신순으로 정렬
select * from member order by point desc, regdate desc;

-- limit: 일부 로우(레코드)를 검색
-- limit 검색할 로우의 개수, limit 시작로우(인덱스) 가져올 로우의 개수
 select * from member limit 2;
 select * from member limit 2, 3;
 
-- 멤버에서 포인트순으로 내림차순 정렬하고 포인트가 같다면 가입순으로 내림차순 한뒤 top 3개를 검색
select * from member order by point desc, regdate desc limit 3;

/*
	group
    select 그룹을 맺을 컬럼 또는 집계함수 from 테이블 group by 그룹을 맺을 컬럼
    select 그룹을 맺을 컬럼 또는 집계함수 from 테이블 group by 그룹을 맺을 컬럼 having 그룹에 대한 조건
*/

select gender from member group by gender;
select gender, count(idx) as 인원수 from member group by gender;
select gender, count(idx) as 인원수 from member group by gender having gender='여자';
select gender, count(idx) as 인원수 from member where gender='여자' group by gender;
-- 성별로 그룹을 맺고 인원수가 3명이상인 성별을 검색
select gender, count(idx) as 인원수 from member group by gender having count(idx) >= 3;
select gender, count(idx) as 인원수 from member group by gender having 인원수 >= 3;
/*
	멤버 중 포인트가 50이상인 멤버중에서 성별로 그룹을 나눈 뒤
	각 그룹의 포인트 평균을 구하고 평균의 포인트가 100이상인 성별을 출력
    (단, 성별이 남자, 여자 모두 출력된다면 포인트가 높은 성별을 우선으로 출력)
*/
select 
	gender, 
    AVG(point) as 포인트평균 
from member 
where point >= 50 
group by gender 
having 포인트평균 >= 100 
order by 포인트평균 desc;


-- 스키마 조회
desc member;
desc voca;
-- 데이터 조회
select * from member;
select * from voca;


update member set zipcode = '', address1 = '' where idx='13'



