# Sales Analytics Platform

A full-stack sales analytics platform which is composed of three main parts:

**Data Warehouse** - stores and transforms sales data using Bronze, Silver, and Gold layers.

**Backend API** - handles business logic, data access, and communication between the warehouse and frontend.

**Frontend Dashboard** - presents sales insights, reports, and visual analytics to users.


## Sales Data Warehouse

A SQL Server data warehouse built on the Medallion Architecture (Bronze, Silver, Gold) to support sales analytics and reporting. This repository contains the data warehouse layer of a broader sales analytics platform.

## Medallion Architecture

<img width="1385" height="645" alt="image" src="https://github.com/user-attachments/assets/2e49b525-4bc1-45eb-89f6-87200f74d4cb" />


### Bronze - Raw Ingestion
Stores data as it arrives from source systems. No transformations are applied. This layer serves as an audit trail and a recovery point if downstream issues occur.

### Silver - Cleansed & Conformed
Applies cleaning, validation, and standardisation rules to the raw Bronze data. This includes deduplication, null handling, type casting, and joining related entities.

### Gold - Business-Ready
Contains aggregated, use-case-specific data models for reporting and dashboard queries. Data at this layer is ready fro direct consumption.


## Tech Stack
- **Database:** SQL Server
- **Backend:** Spring Boot
- **Frontend:** React
