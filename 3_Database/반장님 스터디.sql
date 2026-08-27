
create table subject (
	subject_id int not null primary key,
    subject_name VARCHAR(50) not null,
    description VARCHAR(200),
    created_at DATETIME default now()
);


create table tasks (
	task_id int not null primary key,
    subject_id int not null ,
    title VARCHAR(100) not null,
    content TEXT ,
    priority VARCHAR(10) not null,
    status VARCHAR(10) not null,
    due_date DATE,
	created_at DATETIME default now(),
    foreign key(subject_id) references subject(subject_id)
);


create table study_plans (
	plan_id int not null primary key,
    subject_id int not null,
    plan_title VARCHAR(100) not null,
    plan_date DATE not null,
    start_time TIME not null,
    end_time TIME not null,
    memo VARCHAR(200),
	created_at DATETIME default now(),
    foreign key(subject_id) references subject(subject_id)
);


create table study_logs (
	log_id int not null primary key,
    subject_id INT not null,
    study_date DATE not null,
    study_time INT not null,
    content VARCHAR(300),
    created_at DATETIME default now(),
    foreign key(subject_id) references subject(subject_id)
);


create table task_memos (
	memo_id int not null primary key,
    task_id VARCHAR(50) not null,
    memo VARCHAR(300),
    created_at DATETIME default now(),
    foreign key(task_id) references tasks(task_id)
);