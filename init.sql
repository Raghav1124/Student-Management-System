-- ========================================
-- Student Management System: Normalized DB
-- ========================================

-- Drop tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS timetable;

-- -------------------
-- Users table
-- -------------------
CREATE TABLE users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

-- -------------------
-- Classes table
-- -------------------
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- -------------------
-- Students table
-- -------------------
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- -------------------
-- Teachers table
-- -------------------
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    class_id INTEGER UNIQUE,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- -------------------
-- Timetable table (Normalized structure)
-- -------------------
CREATE TABLE timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    period INTEGER NOT NULL CHECK (period BETWEEN 1 AND 6),
    subject TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    teacher_id INTEGER,
    room TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    UNIQUE(class_id, day, period)
);

-- -------------------
-- Insert Classes
-- -------------------
INSERT INTO classes (name) VALUES
('Class 1'),
('Class 2'),
('Class 3'),
('Class 4');

-- -------------------
-- Insert Students
-- -------------------
INSERT INTO students (name, class_id) VALUES
('Alice', 1), ('Bob', 1), ('Charlie', 1), ('Mona', 1), ('Uma', 1), ('Yara', 1),
('David', 2), ('Eve', 2), ('Frank', 2), ('Oscar', 2), ('Paul', 2), ('Victor', 2),
('Grace', 3), ('Hannah', 3), ('Ivy', 3), ('Quinn', 3), ('Rachel', 3), ('Wendy', 3),
('Jack', 4), ('Karen', 4), ('Leo', 4), ('Steve', 4), ('Tina', 4), ('Xander', 4),
('Zoe', 4);

-- -------------------
-- Insert Teachers
-- -------------------
INSERT INTO teachers (name, subject, class_id) VALUES
('Teacher A', 'Mathematics', 1),
('Teacher B', 'Science', 2),
('Teacher C', 'English Literature', 3),
('Teacher D', 'History', 4),
('Teacher E', 'Physics', NULL),
('Teacher F', 'Chemistry', NULL),
('Teacher G', 'Biology', NULL),
('Teacher H', 'Physical Education', NULL);

-- -------------------
-- Insert Users
-- -------------------
-- Teachers
INSERT INTO users (username, password, role) VALUES
('Teacher A', 'pass123', 'teacher'),
('Teacher B', 'pass123', 'teacher'),
('Teacher C', 'pass123', 'teacher'),
('Teacher D', 'pass123', 'teacher'),
('Teacher E', 'pass123', 'teacher'),
('Teacher F', 'pass123', 'teacher'),
('Teacher G', 'pass123', 'teacher'),
('Teacher H', 'pass123', 'teacher'),

-- Students (Class 1)
('Alice', 'alice123', 'student'),
('Bob', 'bob123', 'student'),
('Charlie', 'charlie123', 'student'),
('Mona', 'mona123', 'student'),
('Uma', 'uma123', 'student'),
('Yara', 'yara123', 'student'),

-- Students (Class 2)
('David', 'david123', 'student'),
('Eve', 'eve123', 'student'),
('Frank', 'frank123', 'student'),
('Oscar', 'oscar123', 'student'),
('Paul', 'paul123', 'student'),
('Victor', 'victor123', 'student'),

-- Students (Class 3)
('Grace', 'grace123', 'student'),
('Hannah', 'hannah123', 'student'),
('Ivy', 'ivy123', 'student'),
('Quinn', 'quinn123', 'student'),
('Rachel', 'rachel123', 'student'),
('Wendy', 'wendy123', 'student'),

-- Students (Class 4)
('Jack', 'jack123', 'student'),
('Karen', 'karen123', 'student'),
('Leo', 'leo123', 'student'),
('Steve', 'steve123', 'student'),
('Tina', 'tina123', 'student'),
('Xander', 'xander123', 'student'),
('Zoe', 'zoe123', 'student');

-- -------------------
-- Insert Timetable (Complete schedule for all classes)
-- -------------------

-- Class 1 - Monday to Friday
INSERT INTO timetable (class_id, day, period, subject, start_time, end_time) VALUES
(1, 'Monday', 1, 'Mathematics', '9:00', '10:00'),
(1, 'Monday', 2, 'English', '10:00', '11:00'),
(1, 'Monday', 3, 'Science', '11:15', '12:15'),
(1, 'Monday', 4, 'History', '12:15', '13:15'),
(1, 'Monday', 5, 'Physical Education', '14:00', '15:00'),
(1, 'Monday', 6, 'Art', '15:00', '16:00'),

(1, 'Tuesday', 1, 'Science', '9:00', '10:00'),
(1, 'Tuesday', 2, 'Mathematics', '10:00', '11:00'),
(1, 'Tuesday', 3, 'English', '11:15', '12:15'),
(1, 'Tuesday', 4, 'Geography', '12:15', '13:15'),
(1, 'Tuesday', 5, 'Music', '14:00', '15:00'),
(1, 'Tuesday', 6, 'Physical Education', '15:00', '16:00'),

(1, 'Wednesday', 1, 'English', '9:00', '10:00'),
(1, 'Wednesday', 2, 'History', '10:00', '11:00'),
(1, 'Wednesday', 3, 'Mathematics', '11:15', '12:15'),
(1, 'Wednesday', 4, 'Science', '12:15', '13:15'),
(1, 'Wednesday', 5, 'Computer Science', '14:00', '15:00'),
(1, 'Wednesday', 6, 'Library', '15:00', '16:00'),

(1, 'Thursday', 1, 'Mathematics', '9:00', '10:00'),
(1, 'Thursday', 2, 'Physics', '10:00', '11:00'),
(1, 'Thursday', 3, 'Chemistry', '11:15', '12:15'),
(1, 'Thursday', 4, 'Biology', '12:15', '13:15'),
(1, 'Thursday', 5, 'English', '14:00', '15:00'),
(1, 'Thursday', 6, 'History', '15:00', '16:00'),

(1, 'Friday', 1, 'Science', '9:00', '10:00'),
(1, 'Friday', 2, 'Mathematics', '10:00', '11:00'),
(1, 'Friday', 3, 'English', '11:15', '12:15'),
(1, 'Friday', 4, 'Physical Education', '12:15', '13:15'),
(1, 'Friday', 5, 'Art', '14:00', '15:00'),
(1, 'Friday', 6, 'Music', '15:00', '16:00');

-- Class 2 - Monday to Friday
INSERT INTO timetable (class_id, day, period, subject, start_time, end_time) VALUES
(2, 'Monday', 1, 'Physics', '9:00', '10:00'),
(2, 'Monday', 2, 'Chemistry', '10:00', '11:00'),
(2, 'Monday', 3, 'Biology', '11:15', '12:15'),
(2, 'Monday', 4, 'Mathematics', '12:15', '13:15'),
(2, 'Monday', 5, 'English', '14:00', '15:00'),
(2, 'Monday', 6, 'History', '15:00', '16:00'),

(2, 'Tuesday', 1, 'Chemistry', '9:00', '10:00'),
(2, 'Tuesday', 2, 'Physics', '10:00', '11:00'),
(2, 'Tuesday', 3, 'Mathematics', '11:15', '12:15'),
(2, 'Tuesday', 4, 'English', '12:15', '13:15'),
(2, 'Tuesday', 5, 'Physical Education', '14:00', '15:00'),
(2, 'Tuesday', 6, 'Art', '15:00', '16:00'),

(2, 'Wednesday', 1, 'Biology', '9:00', '10:00'),
(2, 'Wednesday', 2, 'Mathematics', '10:00', '11:00'),
(2, 'Wednesday', 3, 'Physics', '11:15', '12:15'),
(2, 'Wednesday', 4, 'Chemistry', '12:15', '13:15'),
(2, 'Wednesday', 5, 'Computer Science', '14:00', '15:00'),
(2, 'Wednesday', 6, 'Library', '15:00', '16:00'),

(2, 'Thursday', 1, 'Mathematics', '9:00', '10:00'),
(2, 'Thursday', 2, 'Biology', '10:00', '11:00'),
(2, 'Thursday', 3, 'Chemistry', '11:15', '12:15'),
(2, 'Thursday', 4, 'Physics', '12:15', '13:15'),
(2, 'Thursday', 5, 'English', '14:00', '15:00'),
(2, 'Thursday', 6, 'History', '15:00', '16:00'),

(2, 'Friday', 1, 'Science', '9:00', '10:00'),
(2, 'Friday', 2, 'Mathematics', '10:00', '11:00'),
(2, 'Friday', 3, 'English', '11:15', '12:15'),
(2, 'Friday', 4, 'Physical Education', '12:15', '13:15'),
(2, 'Friday', 5, 'Music', '14:00', '15:00'),
(2, 'Friday', 6, 'Art', '15:00', '16:00');

-- Class 3 - Monday to Friday
INSERT INTO timetable (class_id, day, period, subject, start_time, end_time) VALUES
(3, 'Monday', 1, 'English Literature', '9:00', '10:00'),
(3, 'Monday', 2, 'History', '10:00', '11:00'),
(3, 'Monday', 3, 'Geography', '11:15', '12:15'),
(3, 'Monday', 4, 'Mathematics', '12:15', '13:15'),
(3, 'Monday', 5, 'Science', '14:00', '15:00'),
(3, 'Monday', 6, 'Physical Education', '15:00', '16:00'),

(3, 'Tuesday', 1, 'History', '9:00', '10:00'),
(3, 'Tuesday', 2, 'English Literature', '10:00', '11:00'),
(3, 'Tuesday', 3, 'Mathematics', '11:15', '12:15'),
(3, 'Tuesday', 4, 'Science', '12:15', '13:15'),
(3, 'Tuesday', 5, 'Art', '14:00', '15:00'),
(3, 'Tuesday', 6, 'Music', '15:00', '16:00'),

(3, 'Wednesday', 1, 'Geography', '9:00', '10:00'),
(3, 'Wednesday', 2, 'Mathematics', '10:00', '11:00'),
(3, 'Wednesday', 3, 'English Literature', '11:15', '12:15'),
(3, 'Wednesday', 4, 'History', '12:15', '13:15'),
(3, 'Wednesday', 5, 'Computer Science', '14:00', '15:00'),
(3, 'Wednesday', 6, 'Library', '15:00', '16:00'),

(3, 'Thursday', 1, 'Mathematics', '9:00', '10:00'),
(3, 'Thursday', 2, 'Science', '10:00', '11:00'),
(3, 'Thursday', 3, 'History', '11:15', '12:15'),
(3, 'Thursday', 4, 'Geography', '12:15', '13:15'),
(3, 'Thursday', 5, 'English Literature', '14:00', '15:00'),
(3, 'Thursday', 6, 'Physical Education', '15:00', '16:00'),

(3, 'Friday', 1, 'Science', '9:00', '10:00'),
(3, 'Friday', 2, 'Mathematics', '10:00', '11:00'),
(3, 'Friday', 3, 'English Literature', '11:15', '12:15'),
(3, 'Friday', 4, 'Art', '12:15', '13:15'),
(3, 'Friday', 5, 'Music', '14:00', '15:00'),
(3, 'Friday', 6, 'Physical Education', '15:00', '16:00');

-- Class 4 - Monday to Friday
INSERT INTO timetable (class_id, day, period, subject, start_time, end_time) VALUES
(4, 'Monday', 1, 'History', '9:00', '10:00'),
(4, 'Monday', 2, 'Geography', '10:00', '11:00'),
(4, 'Monday', 3, 'English', '11:15', '12:15'),
(4, 'Monday', 4, 'Mathematics', '12:15', '13:15'),
(4, 'Monday', 5, 'Science', '14:00', '15:00'),
(4, 'Monday', 6, 'Art', '15:00', '16:00'),

(4, 'Tuesday', 1, 'Geography', '9:00', '10:00'),
(4, 'Tuesday', 2, 'History', '10:00', '11:00'),
(4, 'Tuesday', 3, 'Mathematics', '11:15', '12:15'),
(4, 'Tuesday', 4, 'Science', '12:15', '13:15'),
(4, 'Tuesday', 5, 'Physical Education', '14:00', '15:00'),
(4, 'Tuesday', 6, 'Music', '15:00', '16:00'),

(4, 'Wednesday', 1, 'English', '9:00', '10:00'),
(4, 'Wednesday', 2, 'Mathematics', '10:00', '11:00'),
(4, 'Wednesday', 3, 'Science', '11:15', '12:15'),
(4, 'Wednesday', 4, 'History', '12:15', '13:15'),
(4, 'Wednesday', 5, 'Computer Science', '14:00', '15:00'),
(4, 'Wednesday', 6, 'Library', '15:00', '16:00'),

(4, 'Thursday', 1, 'Mathematics', '9:00', '10:00'),
(4, 'Thursday', 2, 'Science', '10:00', '11:00'),
(4, 'Thursday', 3, 'History', '11:15', '12:15'),
(4, 'Thursday', 4, 'Geography', '12:15', '13:15'),
(4, 'Thursday', 5, 'English', '14:00', '15:00'),
(4, 'Thursday', 6, 'Physical Education', '15:00', '16:00'),

(4, 'Friday', 1, 'Science', '9:00', '10:00'),
(4, 'Friday', 2, 'Mathematics', '10:00', '11:00'),
(4, 'Friday', 3, 'History', '11:15', '12:15'),
(4, 'Friday', 4, 'Art', '12:15', '13:15'),
(4, 'Friday', 5, 'Music', '14:00', '15:00'),
(4, 'Friday', 6, 'Physical Education', '15:00', '16:00');