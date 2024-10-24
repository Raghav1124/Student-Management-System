# Student-Management-System

```markdown

This repository contains the SQL schema and sample data for a comprehensive Student Management System designed to facilitate the management of students, teachers, classes, and related entities in an educational environment. The system allows for the management of user logins, parent details, teacher information, class assignments, student records, subjects, and their associated tutors.

## Features

- **Schema Creation**: Easily drop and recreate the entire database schema, ensuring a fresh setup for development or testing.
- **User Management**: Manage user logins and authentication.
- **Parent Details**: Store comprehensive information about parents for each student.
- **Teacher Records**: Maintain detailed records of teachers, including their subjects and classes.
- **Class Management**: Assign teachers to classes and keep track of class years.
- **Student Information**: Manage student records, linking them to their parents and classes.
- **Subject Management**: Define subjects and link them to teachers and classes.
- **Subject Tutors**: Assign teachers to subjects within specific classes.

## Schema Overview

The following tables are created within the `student_management` schema:

1. **user_login**
   - Stores user credentials and personal details.

2. **parent_details**
   - Contains information about students' parents.

3. **teachers**
   - Holds teacher profiles, including personal and contact details.

4. **class_details**
   - Manages class information, including associated teachers.

5. **student_details**
   - Stores records of students, including personal details and links to classes and parents.

6. **subject**
   - Contains information about subjects offered, along with the teacher responsible.

7. **subject_tutors**
   - Links subjects to teachers and specific classes.

## Installation

1. **Set Up the Database**: Execute the SQL script in your SQL database environment (e.g., PostgreSQL, MySQL) to create the schema and tables.

2. **Insert Sample Data**: The provided script includes commands to populate the tables with sample data for testing and development purposes.

## SQL Code

The SQL script includes commands for dropping the existing schema, creating tables, and inserting sample data:

```sql
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
-- (Data insertion commands omitted for brevity)

-- Example JOIN Operations
-- (Example queries omitted for brevity)
```

## Example Queries

The following are example SQL queries that can be run against the database to retrieve meaningful information:

1. **Get All Students with Their Parents' Names**
2. **Get All Classes with Their Teachers**
3. **Get All Subjects with Their Corresponding Teachers**
4. **Get All Students with Their Class and Subject Details**

(Refer to the SQL code for detailed example queries.)

## Requirements

- SQL database environment (PostgreSQL, MySQL, etc.)
- Basic knowledge of SQL for executing commands and queries.
