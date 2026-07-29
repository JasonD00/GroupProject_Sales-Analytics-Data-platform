# Sales Analytics Platform

A full-stack sales analytics platform which is composed of three main parts:

**Data Warehouse** - stores and transforms sales data using Bronze, Silver, and Gold layers.

**Backend API** - handles business logic, data access, and communication between the warehouse and frontend.

**Frontend Dashboard** - presents sales insights, reports, and visual analytics to users.


## Sales Data Warehouse

A SQL Server data warehouse built on the Medallion Architecture (Bronze, Silver, Gold) to support sales analytics and reporting. This repository contains the data warehouse layer of a broader sales analytics platform.

However this is a **Zero-Config Deployment**: and runs entirely in Docker. No local database or language runtimes required, but the scripts for this proeject exist and can run in SQL server.


## Medallion Architecture

<img width="1385" height="645" alt="image" src="https://github.com/user-attachments/assets/2e49b525-4bc1-45eb-89f6-87200f74d4cb" />


### Bronze - Raw Ingestion
Stores data as it arrives from source systems. No transformations are applied. This layer serves as an audit trail and a recovery point if downstream issues occur.

### Silver - Cleansed
Applies cleaning, validation, and standardisation rules to the raw Bronze data. This includes deduplication, null handling, type casting, and joining related entities.

### Gold - Business-Ready
Contains aggregated, use-case-specific data models for reporting and dashboard queries. Data at this layer is ready fro direct consumption.

---
## High Level Architecture Diagram
<img width="930" height="939" alt="image" src="https://github.com/user-attachments/assets/9bf9eec3-621f-400a-84bc-fd4515c641e9" />


---

## Tech Stack

* **Backend:** Spring Boot (Java)
* **Frontend:** React (Vite, TypeScript)
* **Database:** SQL Server (Data Warehouse)
* **DevOps:** Docker & Docker Compose

---

## Prerequisites

Before running the application, ensure you have the following installed:
* [Docker Desktop](https://docker.com) (Installed and running)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/JasonD00/GroupProject_Sales-Analytics-Data-platform.git
cd sales-analytics-api
```

### 2. Configure Environment Variables
Copy the template environment files and configure your values.

**Root Configuration (Docker Settings):**
```bash
cp .env.example .env
```

**Frontend Configuration:**
```bash
cp frontend/.env.example frontend/.env
```

> **Note on frontend/.env:** 
> * Leave `VITE_API_URL` empty to let Docker handle internal routing.
> * If you choose to run the frontend locally *outside* of Docker later, change it to: `VITE_API_URL=http://localhost:8080/`

### 3. Launch the Stack
Spin up the containerized ecosystem with a single command:
```bash
docker-compose up --build
```

**What this does automatically:**
1. Restores the SQL Server Data Warehouse (DW).
2. Compiles and starts the Spring Boot API.
3. Builds and serves the React frontend production asset.

---

## Application Access

Once the build completes, access the services via your browser:

* **Frontend UI:** [http://localhost:3000/](http://localhost:3000/)
* **Backend API:** [http://localhost:8080/](http://localhost:8080/)

---

## First-Time Setup & Authentication

To log in, you must first provide a user account. You can do this via the **Create Account** tab on the web UI login page, or via an API client like Postman:

**Endpoint:** `POST http://localhost:8080/api/auth/register`  
**Headers:** `Content-Type: application/json`

```json
{
  "username": "your_username",
  "password": "your_password",
  "tier": "ENTERPRISE"
}
```

### Available Subscription Tiers

| Tier | Features & Access Scope |
| :--- | :--- |
| **GROWTH** | Overview, Customers, Settings |
| **PRO** | Growth Features + Sales, Territory, Invoices, Data Export |
| **ENTERPRISE** | **Full Access** to all platform capabilities |

---

## Managing the Application

**Stop the application:**
```bash
docker-compose down
```

**Full Reset (Stop containers and wipe all database data):**
```bash
docker-compose down -v
```
