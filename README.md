# 🚀 ApplyFlow AI

**Modernizing a Legacy C++ Job Application Tracker into an AI-Powered Full-Stack Platform**

![.NET](https://img.shields.io/badge/.NET-10-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green)
![xUnit](https://img.shields.io/badge/xUnit-Testing-success)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)

---

## 📖 Overview

ApplyFlow AI is a modern full-stack job application management platform that helps job seekers organize, track, and optimize their job search from a single place.

Instead of maintaining spreadsheets or scattered notes, users can manage applications, organize resumes, monitor progress through dashboards, visualize hiring stages using a Kanban board, and analyze resume compatibility with job descriptions.

This project was developed as a **software re-engineering initiative**, transforming a legacy C++ console-based application into a scalable, API-driven web platform following modern software engineering practices.

---

# 🎯 Why ApplyFlow AI?

Today's hiring process is highly competitive.

Candidates often apply to dozens of jobs across multiple platforms, making it difficult to remember:

* Which companies they applied to
* Which resume they submitted
* The requirements of each job description
* Current application status
* Where improvements are needed before the next application

ApplyFlow AI centralizes the complete job search workflow while laying the foundation for AI-assisted career tools.

---

# 🏛 Legacy Modernization

The original application was a C++ console program that stored application records in flat files.

Although functional, it had several limitations:

* Console-only interaction
* File-based data storage
* Difficult to scale
* No authentication
* No analytics
* No structured APIs
* No automated testing
* Difficult to extend

Instead of rewriting the application feature by feature, the goal was to preserve its business logic while redesigning the architecture for scalability, maintainability, security, and future AI integration.

---

# ✨ Features

## 🔐 Authentication

* JWT Authentication
* Secure Registration & Login
* BCrypt Password Hashing
* Protected Routes
* User Authorization

---

## 📋 Job Application Management

* Create Applications
* Edit Applications
* Delete Applications
* Search & Filter
* Status Tracking
* Notes
* Company Information

---

## 📊 Dashboard

* Application Statistics
* Status Distribution
* Monthly Analytics
* Recent Applications
* Hiring Pipeline Overview

---

## 📌 Kanban Workflow

* Drag & Drop Board
* Status Management
* Hiring Pipeline Visualization

---

## 📄 Resume Library

* Upload Resume
* Resume Management
* Multiple Resume Support
* Default Resume Selection

---

## 🤖 AI Features

### Implemented

* Resume-to-Job Description Analysis
* TF-IDF Based Text Vectorization
* ATS-style Resume Match Scoring

### Planned

* AI Resume Suggestions
* Missing Skills Detection
* Cover Letter Generator
* Interview Preparation Assistant
* Smart Job Recommendations
* Career Insights

---

# 🏗 Architecture

```
                 Next.js Frontend
                        │
                  REST API Layer
                        │
         ASP.NET Core Web API (.NET 10)
                        │
      Controllers → Services → DTOs
                        │
          Entity Framework Core
                        │
               PostgreSQL Database
```

The backend follows a layered architecture to separate business logic, API controllers, and persistence, making the application easier to maintain and extend.

---

# ⚙ Technology Stack

## Backend

* ASP.NET Core Web API (.NET 10)
* C#
* Entity Framework Core
* PostgreSQL
* JWT Authentication
* BCrypt
* Swagger / OpenAPI

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Axios

## AI

* TF-IDF
* Resume Similarity Analysis
* ATS Resume Scoring

## Testing

* xUnit
* Playwright
* ESLint

## DevOps & Productivity

* Git
* GitHub
* Docker
* Jira
* MCP-assisted Development
* Codex CLI

---

# 🧪 Engineering Practices

* Sprint-based Agile Development
* Jira Backlog & Sprint Planning
* Layered Architecture
* RESTful API Design
* DTO Pattern
* Entity Framework Core Migrations
* Automated Testing
* Continuous Validation
* Clean Code Principles

---

# ⚡ Biggest Engineering Challenge

One of the most challenging parts of this project was migrating legacy application data without losing a single record.

The original system stored application records in a file-based format. A migration pipeline was developed to:

* Parse legacy records
* Validate input
* Normalize inconsistent data
* Map records into a relational PostgreSQL schema
* Preserve data integrity throughout the migration

This modernization effort transformed an outdated storage model into a scalable relational database while maintaining historical application data.

---

# ✅ Testing & Automation

The project emphasizes automation to improve software quality and reduce repetitive manual regression testing.

### Backend

* xUnit Unit Tests
* Service Layer Testing
* Authentication Testing

### Frontend

* Playwright End-to-End Tests
* UI Validation
* User Workflow Testing

### Current Status

* ✅ Backend Unit Tests: **21 Passing**
* ✅ Frontend Build: Passing
* ✅ ESLint: Passing
* ✅ Playwright Tests: Passing

---

# 📁 Project Structure

```
ApplyFlow-AI

├── Backend/
├── Frontend/
├── Tests/
├── Migration/
├── Docs/
└── README.md
```

---

# 🚀 Future Roadmap

* AI Resume Suggestions
* Resume Improvement Recommendations
* AI Cover Letter Generator
* Interview Preparation Assistant
* Smart Job Recommendation Engine
* Email Integration
* Career Analytics Dashboard

---

# 📚 What I Learned

This project strengthened my understanding of:

* Legacy System Modernization
* Backend API Development
* Software Architecture
* Database Migration
* Data Integrity
* Automated Testing
* Agile Development
* AI Integration
* Production-style Engineering Practices

---

# 🙏 Acknowledgements

A special thanks to **Sir Kamran** for the guidance and mentorship throughout this project.

His insights into software architecture, Agile methodologies, automation, and modern engineering practices helped shape this project far beyond simply writing code. The experience reinforced the importance of building software that is maintainable, scalable, well-tested, and designed to solve real-world problems.

---

# 📌 Project Status

🚀 **Active Development**

New AI-powered features and workflow improvements are currently being implemented.
