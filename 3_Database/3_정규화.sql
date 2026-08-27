/*
	어느 시험에 무조건나오고 완벽하게 이해하는게 중요!!!!!!
    
	정규화(Normalization)
    - 데이터베이스 테이블을 효율적으로 구조화하는 작업
    - 중복 데이터를 줄이고, 데이터가 꼬이지 않게 테이블을 나누는 과정
    - 데이터 무결성 유지, 유지보수 편리성 증가
    
    정규화 단계
    1. 제1정규형(1NF) 조건
		- 하나의 칸에는 하나의 값만 들어가야 함 (하나의 컬럼에 여러게 들어가면 안된다.)
        예) 과목명 = MySQL, Python(X), 과목명 = MySQL, 과목명 = Python (O)
		
    2. 제2정규형(2NF)
		- 1NF 만족
        - 기본키 전체에 완전 종속되어야 함
        
    3. 제3정규형(3NF)
		- 2NF 만족
		- 이행적 종속 제거
	* 이행적 종속
		학번  -> 학과번호
		학과번호 -> 학과명 
		학번 -> 학과명 : 간접 연결을 이행적 종속이라고 함
        
    - 수정이상: 같은 정보가 여러 줄에 중복 저장되어 있어서, 하나를 수정할 때 여러 곳을 다 같이 수정해야 하는 문제
    - 삭제이상: 어떤 데이터를 삭제했을 때, 원하지 않는 다른 정보까지 같이 사라지는 문제
    - 삽입이상: 어떤 데이터를 넣고 싶은데, 다른 정보가 없어서 데이터를 넣지 못하는 문제
*/
CREATE TABLE student_course (
    student_id INT,
    student_name VARCHAR(50),
    course_name VARCHAR(50),
    professor_name VARCHAR(50),
    professor_phone VARCHAR(20)
);

CREATE TABLE student (
    student_id INT primary key,			-- 학번
    student_name VARCHAR(50) not null 	-- 학생이름
);

CREATE TABLE professor (
	professor_id int primary key,			-- 교수번호
    professor_name VARCHAR(50) not null,	-- 교수명
    professor_phone VARCHAR(20) 			-- 교수번호
);

CREATE TABLE course (
	course_id int primary key,			-- 학과번호
    course_name VARCHAR(50) not null,	-- 학과명
    professor_id int,					-- 교수번호 외래키
    foreign key(professor_id) references professor(professor_id)
);

CREATE TABLE enroll (
	student_id int,
    course_id int,
    foreign key(student_id) references student(student_id),
    foreign key(course_id) references course(course_id),
    -- primary key를 여러게 할수 있다.
    primary key(student_id)
);

CREATE TABLE profile (
	idx int not null,
    height double,
    weight double,
    mbti varchar(10),
    foreign key(idx) references member(idx)
);

insert into profile values(1, 160, 50, 'ISTJ');
insert into profile values(2, 170, 70, 'ESTP');
insert into profile values(4, 175, 80, 'ENFJ');
insert into profile values(5, 173, 64, 'ESFP');

delete from profile where idx='5';

-- idx, userid, name, gender, mbti
select 
	member.idx, 
    userid, 
    name, 
    gender, 
    mbti
from member
inner join profile
on member.idx = profile.idx;

-- inner join
select 
    m.idx 
  , m.userid
  , m.name
  , m.gender
  , p.mbti
from member as m
inner join profile as p
on m.idx = p.idx;

-- left join
select 
    m.idx 
  , m.userid
  , m.name
  , m.gender
  , p.mbti
from member as m
left join profile as p
on m.idx = p.idx;

-- right join 
select 
    m.idx 
  , m.userid
  , m.name
  , m.gender
  , p.mbti
from member as m
right join profile as p
on m.idx = p.idx
order by p.idx;

-- cross join 
select 
    userid
  , name
  , gender
  , mbti
from member
cross join profile;


select * from member;
select * from profile;

