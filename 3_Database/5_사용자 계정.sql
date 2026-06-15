/*
	사용자 계정
    - 데이터베이스에 접속할 수 있는 로그인 계정
    - root 계정은 모든 권한을 가진 계정이기 때문에 실제 사용시 위험할 수 있음
    - 프로젝트별로 계정을 따로 만들고, 필요한 권한만 부여하는 것이 일반적
*/
-- create user '계정명'@'접속위치' identified by '비밀번호'
-- localhost: 같은 컴퓨터(내 컴퓨터)에서만 접속
-- 'apple'@'%': 어디서든 접속 가능
-- 'apple'@'192.168.0.%': 192.168.0.으로 시작하는 내부망에서만 접속이 가능
-- 'apple'@'192.168.0.10': 특정 ip에서만 접속 가능

create user 'apple'@'localhost' identified by '1111';

-- grant 권한 종류 on 데이터베이스명.테이블명 to '계정명'@'접속위치';
-- all: 모든 일반 권한, select, insert, update, delete, create, drop, alter, index
-- ai.*: ai 데이터베이스 안의 모든 테이블(*.*(모든 데이터베이스), ai.member)
-- grant select, insert, update on ai.* to 'apple'@'localhost'; 주고싶은것만 줄수 있음
grant all on ai.* to 'apple'@'localhost';

show grants for 'apple'@'localhost';

create user 'banana'@'localhost' identified by '2222';
grant select on ai.* to 'apple'@'localhost';

create user 'orange'@'localhost' identified by '3333';
grant select, insert, update, delete on ai.* to 'orange'@'localhost';
-- 권한 회수
revoke delete on ai.* from 'orange'@'localhost';

-- 사용자 비밀번호 변경
alter user 'banana'@'localhost' identified by '1004';

-- 사용자 삭제
drop user 'banana'@'localhost';

-- 데이터베이스 생성 : testdb
create database testdb;
use testdb;
-- 테이블 생성 : member
create table member(
	idx int auto_increment primary key,
    userid varchar(20) unique not null,
    userpw varchar(20) not null,
    name varchar(20) not null,
    hp varchar(20) not null,
    email varchar(50) not null,
    ssn1 char(6) not null,
    ssn2 char(7) not null,
    zipcode varchar(5),
    address1 varchar(100),
    address2 varchar(100),
    address3 varchar(100),
    regdate datetime default now(),
    point int default 1000
);
-- 사용자 계정 생성 : user1/1111, user2/1111 권한 select, update, insert
create user 'juyoung'@'192.168.12.%' identified by '1111';
create user 'hyewon'@'192.168.9.%' identified by '2222';
grant select, update, insert on testdb.* to 'juyoung'@'192.168.12.%';
grant select, update, insert on testdb.* to 'hyewon'@'192.168.9.%';

-- 다른사람이 내가 만든 사용자 계정에 접속하려면 내 ip주소를 hostname에 넣어서 접속 해야함.


use ai;
select * from member;

