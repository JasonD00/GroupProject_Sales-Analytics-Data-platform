/*
================================================================
Creation of the Silver Tables
================================================================
Overview:
   Tables are created in the silver layer/schema. Pre existing
   tables are dropped if they have existed already.

================================================================
*/

IF OBJECT_ID('silver.crm_client_info', 'U') IS NOT NULL
    DROP TABLE silver.crm_client_info;
GO

CREATE TABLE silver.crm_client_info (

client_id INT,
client_key NVARCHAR(50),
client_firstname NVARCHAR(50),
client_lastname NVARCHAR(50),
client_marital_status NVARCHAR(50),
client_gender NVARCHAR(50),
client_create_dt DATE,
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO

IF OBJECT_ID('silver.crm_product_info', 'U') IS NOT NULL
    DROP TABLE silver.crm_product_info;
GO

CREATE TABLE silver.crm_product_info (
prod_id INT,
prod_key NVARCHAR(50),
prod_nm NVARCHAR(50),
prod_cost INT,
prod_type NVARCHAR(50),
prod_start_dt DATETIME,
prod_end_dt DATETIME,
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO

IF OBJECT_ID('silver.crm_sales_info', 'U') IS NOT NULL
    DROP TABLE silver.crm_sales_info;
GO


CREATE TABLE silver.crm_sales_info (
sales_ord_num NVARCHAR(50),
sales_prd_key NVARCHAR(50),
sales_client_id INT,
sales_order_dt INT,
sales_ship_dt INT,
sales_due_dt INT,
sales_sales INT,
sales_quantity INT,
sales_price INT,
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO


IF OBJECT_ID('silver.erp_invoice_client', 'U') IS NOT NULL
    DROP TABLE silver.erp_invoice_client;
GO


CREATE TABLE silver.erp_invoice_client (
clientid NVARCHAR(50),		
client_country NVARCHAR(50),
client_birth_dt	 DATE,
client_gender NVARCHAR(50),
client_account_status	NVARCHAR(50),
client_segment NVARCHAR(50),
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO	


IF OBJECT_ID('silver.erp_product_details', 'U') IS NOT NULL
    DROP TABLE silver.erp_product_details;
GO


CREATE TABLE silver.erp_product_details (
product_key NVARCHAR(50),
Product_category NVARCHAR(50),
Product_subcategory	NVARCHAR(50),
Product_maintenance	 NVARCHAR(50),
product_level INT,
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO	


IF OBJECT_ID('silver.erp_invoice_transactions', 'U') IS NOT NULL
    DROP TABLE silver.erp_invoice_transactions;
GO


CREATE TABLE silver.erp_invoice_transactions (
Invoice_id NVARCHAR(50),				
Invoice_ord_num NVARCHAR(50),	
Invoice_status	NVARCHAR(50),	
Invoice_issue_dt DATE,
dw_create_date    DATETIME2 DEFAULT GETDATE()
);
GO

