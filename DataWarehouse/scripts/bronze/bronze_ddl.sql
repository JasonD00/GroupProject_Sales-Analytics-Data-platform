/*
================================================================
Creation of the Bronze Tables
================================================================
Overview:
   Tables are created in the bronze layer/schema. Pre existing
   tables are dropped if they have existed already.

   This script includes the creation of the CRMs:
  - crm_client_info
  - crm.product_info
  - crm_sales_info

    This script includes the creation of the ERPs:
  - erp_invoice_client
  - erp.product_details
  - erp.invoice_transactions

================================================================
*/


IF OBJECT_ID('bronze.crm_client_info', 'U') IS NOT NULL
    DROP TABLE bronze.crm_client_info;
GO

CREATE TABLE bronze.crm_client_info (

client_id INT,
client_key NVARCHAR(50),
client_firstname NVARCHAR(50),
client_lastname NVARCHAR(50),
client_marital_status NVARCHAR(50),
client_gender NVARCHAR(50),
client_create_dt DATE
);
GO

IF OBJECT_ID('bronze.crm_product_info', 'U') IS NOT NULL
    DROP TABLE bronze.crm_product_info;
GO

CREATE TABLE bronze.crm_product_info (
prod_id INT,
prod_key NVARCHAR(50),
prod_nm NVARCHAR(50),
prod_cost INT,
prod_type NVARCHAR(50),
prod_start_dt DATETIME,
prod_end_dt DATETIME
);
GO

IF OBJECT_ID('bronze.crm_sales_info', 'U') IS NOT NULL
    DROP TABLE bronze.crm_sales_info;
GO


CREATE TABLE bronze.crm_sales_info (
sales_ord_num NVARCHAR(50),
sales_prd_key NVARCHAR(50),
sales_client_id INT,
sales_order_dt INT,
sales_ship_dt INT,
sales_due_dt INT,
sales_sales INT,
sales_quantity INT,
sales_price INT
);
GO


IF OBJECT_ID('bronze.erp_invoice_client', 'U') IS NOT NULL
    DROP TABLE bronze.erp_invoice_client;
GO


CREATE TABLE bronze.erp_invoice_client (
clientid NVARCHAR(50),		
client_country NVARCHAR(50),
client_birth_dt	 DATE,
client_gender NVARCHAR(50),
client_account_status	NVARCHAR(50),
client_segment NVARCHAR(50)
);
GO	


IF OBJECT_ID('bronze.erp_product_details', 'U') IS NOT NULL
    DROP TABLE bronze.erp_product_details;
GO


CREATE TABLE bronze.erp_product_details (
product_key NVARCHAR(50),
product_category NVARCHAR(50),
product_subcategory	NVARCHAR(50),
product_maintenance	 NVARCHAR(50),
product_level INT
);
GO	


IF OBJECT_ID('bronze.erp_invoice_transactions', 'U') IS NOT NULL
    DROP TABLE bronze.erp_invoice_transactions;
GO


CREATE TABLE bronze.erp_invoice_transactions (
invoice_id NVARCHAR(50),				
invoice_ord_num NVARCHAR(50),	
invoice_status	NVARCHAR(50),	
invoice_issue_dt DATE
);
GO
