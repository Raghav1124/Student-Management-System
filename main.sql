-- Drop and Create Schema
DROP SCHEMA IF EXISTS student_management CASCADE; 
CREATE SCHEMA IF NOT EXISTS student_management;

-- Create Tables
CREATE TABLE IF NOT EXISTS student_management.user_login (
    user_id TEXT PRIMARY KEY,
    user_password TEXT,
    first_name TEXT,
    last_name TEXT,
    sign_up_on DATE,
    email_id TEXT
);

CREATE TABLE IF NOT EXISTS student_management.parent_details (
    parent_id TEXT PRIMARY KEY,
    father_first_name TEXT,
    father_last_name TEXT,
    father_email_id TEXT,
    father_mobile TEXT,
    father_occupation TEXT,
    mother_first_name TEXT,
    mother_last_name TEXT,
    mother_email_id TEXT,
    mother_mobile TEXT,
    mother_occupation TEXT
);

CREATE TABLE IF NOT EXISTS student_management.teachers (
    teacher_id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    email_id TEXT,
    contact TEXT,
    registration_date DATE,
    registration_id TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS student_management.class_details (
    class_id TEXT PRIMARY KEY,
    class_teacher TEXT REFERENCES student_management.teachers (teacher_id),
    class_year TEXT
);

CREATE TABLE IF NOT EXISTS student_management.student_details (
    student_id TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE,
    class_id TEXT REFERENCES student_management.class_details (class_id),
    roll_no TEXT,
    email_id TEXT,
    parent_id TEXT REFERENCES student_management.parent_details (parent_id),
    registration_date DATE,
    registration_id TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS student_management.subject (
    subject_id TEXT PRIMARY KEY,
    subject_name TEXT,
    class_year TEXT,
    subject_head TEXT REFERENCES student_management.teachers (teacher_id)
);

CREATE TABLE IF NOT EXISTS student_management.subject_tutors (
    row_id SERIAL PRIMARY KEY,
    subject_id TEXT REFERENCES student_management.subject (subject_id),
    teacher_id TEXT REFERENCES student_management.teachers (teacher_id),
    class_id TEXT REFERENCES student_management.class_details (class_id)
);

-- Inserting Sample Data
INSERT INTO student_management.user_login (user_id, user_password, first_name, last_name, sign_up_on, email_id) VALUES
('user1', 'pass123', 'Alice', 'Brown', '2024-01-10', 'alice.brown@example.com'),
('user2', 'pass456', 'Bob', 'Smith', '2024-01-15', 'bob.smith@example.com');

INSERT INTO student_management.parent_details (parent_id, father_first_name, father_last_name, father_email_id, father_mobile, father_occupation, mother_first_name, mother_last_name, mother_email_id, mother_mobile, mother_occupation) VALUES
('parent1', 'John', 'Brown', 'john.brown@example.com', '1234567890', 'Engineer', 'Emily', 'Brown', 'emily.brown@example.com', '0987654321', 'Teacher'),
('parent2', 'Michael', 'Smith', 'michael.smith@example.com', '2345678901', 'Doctor', 'Sarah', 'Smith', 'sarah.smith@example.com', '1234567899', 'Nurse');

INSERT INTO student_management.teachers (teacher_id, first_name, last_name, date_of_birth, email_id, contact, registration_date, registration_id) VALUES
('teacher1', 'Laura', 'Green', '1985-06-15', 'laura.green@example.com', '3456789012', '2024-01-01', 'reg001'),
('teacher2', 'David', 'White', '1990-02-20', 'david.white@example.com', '4567890123', '2024-01-02', 'reg002');

INSERT INTO student_management.class_details (class_id, class_teacher, class_year) VALUES
('class1', 'teacher1', '2024'),
('class2', 'teacher2', '2024');

INSERT INTO student_management.student_details (student_id, first_name, last_name, date_of_birth, class_id, roll_no, email_id, parent_id, registration_date, registration_id) VALUES
('student1', 'Chris', 'Johnson', '2005-03-05', 'class1', '001', 'chris.johnson@example.com', 'parent1', '2024-01-10', 'stud001'),
('student2', 'Sophia', 'Davis', '2006-07-10', 'class2', '002', 'sophia.davis@example.com', 'parent2', '2024-01-15', 'stud002');

INSERT INTO student_management.subject (subject_id, subject_name, class_year, subject_head) VALUES
('subject1', 'Mathematics', '2024', 'teacher1'),
('subject2', 'Science', '2024', 'teacher2');

INSERT INTO student_management.subject_tutors (subject_id, teacher_id, class_id) VALUES
('subject1', 'teacher1', 'class1'),
('subject2', 'teacher2', 'class2');

-- Example JOIN Operations

-- 1. Get All Students with Their Parents' Names
SELECT 
    s.first_name AS student_first_name, 
    s.last_name AS student_last_name,
    p.father_first_name,
    p.mother_first_name
FROM 
    student_management.student_details s
JOIN 
    student_management.parent_details p ON s.parent_id = p.parent_id;

-- 2. Get All Classes with Their Teachers
SELECT 
    c.class_id, 
    c.class_year, 
    t.first_name AS teacher_first_name, 
    t.last_name AS teacher_last_name
FROM 
    student_management.class_details c
JOIN 
    student_management.teachers t ON c.class_teacher = t.teacher_id;

-- 3. Get All Subjects with Their Corresponding Teachers
SELECT 
    sub.subject_name, 
    t.first_name AS teacher_first_name, 
    t.last_name AS teacher_last_name
FROM 
    student_management.subject sub
JOIN 
    student_management.teachers t ON sub.subject_head = t.teacher_id;

-- 4. Get All Students with Their Class and Subject Details
SELECT 
    s.first_name AS student_first_name, 
    s.last_name AS student_last_name, 
    c.class_year, 
    sub.subject_name
FROM 
    student_management.student_details s
JOIN 
    student_management.class_details c ON s.class_id = c.class_id
JOIN 
    student_management.subject sub ON c.class_year = sub.class_year
WHERE 
    sub.class_year = c.class_year;
