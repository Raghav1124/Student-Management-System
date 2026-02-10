# Student Management System

A modern, web-based Student Management System built with Flask, SQLite, and Bootstrap. This application provides a complete solution for managing students, teachers, classes, and timetables with role-based access control.

![Student Management System](https://img.shields.io/badge/Flask-2.3.3-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey)

## 🌟 Features

### 🔐 Authentication & Authorization
- **Dual Role System**: Teacher and Student roles with different permissions
- **Secure Login/Logout**: Session-based authentication
- **Role-Based Access Control**: Teachers have additional privileges
- **Signup System**: New user registration with password validation

### 📊 Dashboard
- **Personalized Welcome**: Displays user-specific information
- **Statistics Cards**: Real-time counts of students, teachers, and classes
- **Quick Actions**: Easy access to main features
- **Recent Activity**: Track system activities

### 👥 Student Management
- **Student Directory**: View all students with filtering
- **Class Assignment**: Students organized by classes
- **Search & Sort**: Find students quickly
- **Export Options**: Export data as CSV/JSON

### 👨‍🏫 Teacher Management
- **Teacher Directory**: View all teaching staff
- **Subject Assignment**: Teachers assigned to subjects and classes
- **My Class**: Teachers can view their assigned class students

### 📅 Timetable Management
- **Interactive Timetable**: View weekly schedules
- **Class Selection**: Switch between different class timetables
- **Period Details**: Click subjects for detailed information
- **Room Assignments**: View classroom locations
- **Print Support**: Printable timetable formats

### 🎨 User Interface
- **Modern Design**: Clean, responsive Bootstrap 5 interface
- **Smooth Animations**: Page transitions and hover effects
- **Mobile Responsive**: Works on all device sizes
- **Dark Mode Ready**: Bootstrap components with dark theme support

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Web browser (Chrome, Firefox, Edge, etc.)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Initialize Database
```bash
python init_db.py
```

### 5. Run the Application
```bash
python app.py
```

### 6. Access the Application
Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## 🔐 Default Login Credentials

### Teachers
| Username | Password | Role    | Class   |
|----------|----------|---------|---------|
| Teacher A | pass123  | teacher | Class 1 |
| Teacher B | pass123  | teacher | Class 2 |
| Teacher C | pass123  | teacher | Class 3 |
| Teacher D | pass123  | teacher | Class 4 |

### Students
| Username | Password | Role    | Class   |
|----------|----------|---------|---------|
| Alice    | alice123 | student | Class 1 |
| Bob      | bob123   | student | Class 1 |
| Charlie  | charlie123 | student | Class 1 |
| David    | david123 | student | Class 2 |
| ... and 20+ more students |

## 🏗️ Project Structure

```
student_management_system/
│
├── app.py                      # Main Flask application
├── init_db.py                  # Database initialization script
├── init.sql                    # Database schema and sample data
├── requirements.txt            # Python dependencies
├── README.md                   # This file
│
├── templates/                  # HTML templates
│   ├── base.html              # Base template with navigation
│   ├── login.html             # Login page
│   ├── signup.html            # Signup page
│   ├── dashboard.html         # Dashboard page
│   ├── students.html          # Students list page
│   ├── teachers.html          # Teachers list page
│   ├── timetable.html         # Timetable page
│   ├── my_class.html          # Teacher's class page
│   ├── 404.html               # 404 error page
│   └── 500.html               # 500 error page
│
└── static/                     # Static assets
    ├── css/
    │   ├── style.css          # Main CSS file
    │   └── transitions.css    # CSS animations and transitions
    └── js/
        ├── script.js          # Main JavaScript
        └── transitions.js     # Page transition animations
```

## 🗄️ Database Schema

The system uses a normalized SQLite database with the following tables:

### Tables
1. **users** - User authentication (username, password, role)
2. **classes** - Class information (id, name)
3. **students** - Student details with class assignments
4. **teachers** - Teacher details with subject and class assignments
5. **timetable** - Normalized timetable structure with periods 1-6

### Key Features
- **Foreign Key Constraints**: Ensures data integrity
- **Normalized Structure**: Efficient data organization
- **Cascade Deletes**: Automatic cleanup of related records
- **Unique Constraints**: Prevents duplicate entries

## 🎯 User Roles

### 👨‍🏫 Teacher Role
- View all students
- View all teachers
- Access "My Class" page
- View timetables for all classes
- Special teacher dashboard features

### 👨‍🎓 Student Role
- View student directory
- View teacher directory
- Access personal timetable
- Limited dashboard features

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/classes` | GET | Get all classes |
| `/api/timetable/<class_id>` | GET | Get timetable for specific class |
| `/api/students` | GET | Get all students (JSON format) |
| `/api/my_class/students` | GET | Get students in teacher's class |

## 🎨 UI Components

### Navigation
- **Responsive Navbar**: Collapses on mobile devices
- **Role-Based Menu Items**: Different options for teachers/students
- **User Dropdown**: Quick access to profile and logout

### Cards & Tables
- **Interactive Cards**: Hover effects and animations
- **Sortable Tables**: Click headers to sort columns
- **Search Filter**: Real-time search across tables
- **Pagination**: Large datasets split across pages

### Forms
- **Validation**: Client and server-side validation
- **Password Strength**: Visual password strength indicator
- **Feedback Messages**: Clear error/success messages

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Local Deployment
```bash
python app.py
```

### Production Deployment
For production, consider:
1. Using Gunicorn or uWSGI as WSGI server
2. Setting up Nginx as reverse proxy
3. Using PostgreSQL instead of SQLite
4. Implementing environment variables for configuration
5. Setting up SSL/TLS certificates

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 🛠️ Development

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### Code Style
```bash
# Install formatting tools
pip install black flake8

# Format code
black app.py init_db.py

# Check code style
flake8 app.py init_db.py
```

### Database Migrations
For database changes, create migration scripts:
```bash
# Example migration script
# migrations/001_add_email_to_students.py
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

1. **Database Lock Error**
```bash
# Kill all Python processes
taskkill /f /im python.exe

# Delete database file
del database.db

# Reinitialize
python init_db.py
```

2. **Port Already in Use**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID [PID] /F
```

3. **Module Not Found**
```bash
# Reinstall requirements
pip install -r requirements.txt
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [SQLite](https://www.sqlite.org/) - Database engine
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon library


## 🚀 Quick Start Commands

```bash
# One-line setup (Windows)
git clone https://github.com/yourusername/student-management-system.git && cd student-management-system && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python init_db.py && python app.py

# One-line setup (Mac/Linux)
git clone https://github.com/yourusername/student-management-system.git && cd student-management-system && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python init_db.py && python app.py
```

---

<div align="center">
  
Made with ❤️ using Flask & Bootstrap

⭐ Star this repo if you found it useful!

[Report Bug](https://github.com/yourusername/student-management-system/issues) · [Request Feature](https://github.com/yourusername/student-management-system/issues)

</div>



## 🔗 Useful Links

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Project Wiki](https://github.com/yourusername/student-management-system/wiki)

---

