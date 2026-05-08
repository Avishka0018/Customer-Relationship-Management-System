
# CRM System

---

## Project Overview

This is a full-stack **CRM (Customer Relationship Management) Lead Management System** built as part of a technical assessment.

The system allows a sales team to manage leads, track their progress through a sales pipeline, add internal notes, and monitor performance using a dashboard.

### Core Purpose:
To simulate a real-world CRM used by sales teams to:
- Manage potential customers (leads)
- Track sales pipeline stages
- Store communication notes
- Analyze deal performance

---

## Tech Stack Used

### Frontend:
- React.js
- Axios
- Tailwind CSS
- React Router

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)

### Authentication:
- JWT (JSON Web Token)

### Tools:
- Git & GitHub
- Postman (API testing)

---

## Features Implemented

### Authentication
- Login system (protected routes)
- Test user login required to access CRM

### Lead Management (CRUD)
- Create new leads
- View all leads
- Edit leads
- Delete leads
- Update lead status

### Lead Fields
Each lead contains:
- Lead Name
- Company Name
- Email
- Phone Number
- Lead Source
- Assigned Salesperson
- Status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- Estimated Deal Value
- Created Date
- Last Updated Date

---

### Lead Notes
- Add notes to each lead
- Track communication history
- Store:
  - Note content
  - Created by
  - Created date

---

### Dashboard
The dashboard displays:
- Total Leads
- New Leads
- Qualified Leads
- Won Leads
- Lost Leads
- Total Estimated Deal Value
- Total Value of Won Deals

---

### Search & Filtering
- Filter leads by:
  - Status
  - Lead Source
  - Assigned Salesperson
- Search by:
  - Lead Name
  - Company Name
  - Email

---

## How to Run Locally

### 1. Clone Repository
```bash
git clone https://github.com/Avishka0018/Customer-Relationship-Management-System.git
cd Customer-Relationship-Management-System
```

### Backend Setup
```bash
cd server
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Backend (.env)
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### Test Login Credentials
```bash
Email: admin@example.com
Password: password123
```

### Database Setup
- Install MongoDB locally 
- Create database: crm_db
- Add MongoDB connection string to .env
- Start backend server
- Collections will be created automatically

---

## Known Limitations
- No role-based access control (Admin/User separation not implemented)
- No email notification system
- UI can be improved for mobile responsiveness
- No advanced analytics or forecasting features

---

## Reflection
This project helped me understand how a real-world CRM system works and improved my full-stack development skills.
### Key Learnings:
- Building RESTful APIs using Express.js
- Managing MongoDB database schemas
- Implementing JWT authentication
- Connecting frontend and backend systems
- Designing dashboard UI

### Challenges Faced:
- Handling large lead datasets efficiently
- Managing table UI layout (scroll + sticky columns)
- Structuring backend APIs properly










