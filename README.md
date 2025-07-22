# 🎉 SNS-Events

SNS-Events is an event management platform built with **React** (frontend), **Django** (backend), and **MongoDB** (database). It supports two types of users: **Admin** and **User**.

---

## 🚀 Features

### 👩‍💼 Admin

- Admin accounts are **pre-created** (new users cannot register as admins).
- Admins can **sign in** to the platform.
- Admin Dashboard allows:
  - ✅ Creating new events
  - 📋 Viewing all events created by the admin

### 🙋 User

- Users can **register** using personal details.
- Users can **sign in** to the platform.
- User Dashboard provides:
  - 🌐 Access to all events created by multiple admins

---

## 🛠 Tech Stack

| Layer        | Tech                     |
|--------------|--------------------------|
| Frontend     | React (JSX), TailwindCSS |
| Backend      | Django REST Framework    |
| Database     | MongoDB                  |
| API Handling | Axios                    |
| Auth         | JWT (stored in `sessionStorage`) |

---

## ⚙️ How It Works

1. Admins create and manage events.
2. Users view events created by any admin.
3. All events are shared and visible to users across the platform.

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/rahulpihub/SNS-Events.git
cd SNS-Events
```

### **2. Install Frontend Dependencies**

```bash
cd frontend
npm install
```

### **3. Start the Frontend**

```bash
npm run dev
```

### **4. Start the Backend**

```bash
cd backend
python manage.py runserver
```

---

## **Architecture Link**
📌 [Click here to view the full architecture diagram](https://drive.google.com/file/d/1E3PLprkMuBjPgmbgP2L1ozhXDR8_GU82/view?usp=sharing)



