# **SNS-Events**

This is an event management platform with two types of users: **Admin** and **User**.
The application is built with **React (frontend)**, **Django (backend)**, and **MongoDB (database)**.

---

## **Features**

### **1. Admin**

* Admin accounts are **pre-created** (cannot be registered by new users).
* Admins can **sign in** to the platform.
* Admins have access to an **Admin Dashboard**, where they can:

  * **Create new events**.
  * **View all events created by themselves**.

### **2. User**

* Users can **register** with their personal details.
* Users can **sign in** to the platform.
* Users have access to a **User Dashboard**, where they can:

  * **View all events** created by multiple admins.


---

## **Tech Stack**

* **Frontend:** React (JSX), TailwindCSS
* **Backend:** Python, Django REST Framework
* **Database:** MongoDB
* **API Calls:** Axios
* **Authentication:** JWT (stored in session storage)
---

## **How It Works**

1. **Admins** manage the events (create, view).
2. **Users** browse and register/book for events.
3. Events created by multiple admins are **visible to all users**.

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

## **Folder Structure**

* **frontend/** – React JSX code
* **backend/** – Django backend APIs
* **database/** – MongoDB collections

