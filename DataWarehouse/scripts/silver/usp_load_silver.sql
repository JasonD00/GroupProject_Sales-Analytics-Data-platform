/*
================================================================
Silver Layer -- Stored Procedure: Load Silver
================================================================
Overview:
    Clean's, transforms, and loads data from the Bronze layer 
    into the Silver layer tables.
    Covers both CRM and ERP source systems.
    Each table is wiped clean before transformed data is loaded in.
    Tracks how long each individual table load takes, plus the
    total time for the full batch.

    TRUNCATE runs before every load, existing Silver data will
    be permanently wiped before new data comes in.

    To execute the stored procedure, run the line below:
    EXEC silver.load_silver
================================================================
*/

CREATE OR ALTER PROCEDURE silver.load_silver AS
BEGIN
-- Runtime variables to track load durations, individual and full procedures
    DECLARE @start_time DATETIME, @end_time DATETIME, @batch_start_time DATETIME, @batch_end_time DATETIME;
-- Wrapped in a try/catch, debugging
    BEGIN TRY
        -- time stamp for calculating how long the entire batch took to load 
        SET @batch_start_time = GETDATE();
        PRINT '===============================================';
        PRINT 'Loading the Silver Layer';
        PRINT '===============================================';

        -- ============================================================
        -- CRM TABLES
        -- ============================================================

        PRINT '===============================================';
        PRINT ' CRM Tables being loaded';
        PRINT '===============================================';

        -- Load CRM client data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.crm_client_info';
        TRUNCATE TABLE silver.crm_client_info;
        PRINT '-- Inserting Data Into: silver.crm_client_info';
        INSERT INTO silver.crm_client_info (
            client_id,
            client_key,
            client_firstname,
            client_lastname,
            client_marital_status,
            client_gender,
            client_create_dt
        )
        SELECT
            client_id,
            client_key,
            client_firstname,
            client_lastname,
            CASE WHEN UPPER(client_marital_status) = 'S' THEN 'Single'
                 WHEN UPPER(client_marital_status) = 'M' THEN 'Married'
                 ELSE 'n/a'
            END AS client_marital_status,
            CASE WHEN UPPER(client_gender) = 'F' THEN 'Female'
                 WHEN UPPER(client_gender) = 'M' THEN 'Male'
                 ELSE 'n/a'
            END AS client_gender,
            client_create_dt
        FROM (
            SELECT
                *,
                ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY client_create_dt DESC) AS flag_last -- Flag duplicate records (J)
            FROM bronze.crm_client_info
        ) t 
        WHERE flag_last = 1;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        -- Load CRM product data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.crm_product_info';
        TRUNCATE TABLE silver.crm_product_info;
        PRINT '-- Inserting Data Into: silver.crm_product_info';
        INSERT INTO silver.crm_product_info (
            prod_id,
            prod_key,
            prod_nm,
            prod_cost,
            prod_type,
            prod_start_dt,
            prod_end_dt
        )
        SELECT
            prod_id,
            prod_key,
            prod_nm,
            prod_cost,
            prod_type,
            CAST(prod_start_dt AS DATE) AS prod_start_dt,
            CAST(prod_end_dt AS DATE) AS prod_end_dt
        FROM bronze.crm_product_info;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        -- Load CRM sales data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.crm_sales_info';
        TRUNCATE TABLE silver.crm_sales_info;
        PRINT '-- Inserting Data Into: silver.crm_sales_info';
        INSERT INTO silver.crm_sales_info (
            sales_ord_num,
            sales_prd_key,
            sales_client_id,
            sales_order_dt,
            sales_ship_dt,
            sales_due_dt,
            sales_sales,
            sales_quantity,
            sales_price
        )
        SELECT
            sales_ord_num,
            sales_prd_key,
            sales_client_id,
            CASE WHEN sales_order_dt = 0 OR LEN(sales_order_dt) != 8 THEN NULL
                 ELSE CAST(CAST(sales_order_dt AS VARCHAR) AS DATE)
            END AS sales_order_dt,
            CASE WHEN sales_ship_dt = 0 OR LEN(sales_ship_dt) != 8 THEN NULL
                 ELSE CAST(CAST(sales_ship_dt AS VARCHAR) AS DATE)
            END AS sales_ship_dt,
            CASE WHEN sales_due_dt = 0 OR LEN(sales_due_dt) != 8 THEN NULL
                 ELSE CAST(CAST(sales_due_dt AS VARCHAR) AS DATE)
            END AS sales_due_dt,
            CASE WHEN sales_sales IS NULL OR sales_sales <= 0 OR sales_sales != sales_quantity * ABS(sales_price)
                    THEN sales_quantity * ABS(sales_price)
                 ELSE sales_sales
            END AS sales_sales,
            sales_quantity,
            CASE WHEN sales_price IS NULL OR sales_price <= 0
                    THEN sales_sales / NULLIF(sales_quantity, 0)
                 ELSE sales_price
            END AS sales_price
        FROM bronze.crm_sales_info;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        -- ============================================================
        -- ERP TABLES
        -- ============================================================

        PRINT '===============================================';
        PRINT ' ERP Tables being loaded';
        PRINT '===============================================';

        -- Load ERP client invoice data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.erp_invoice_client';
        TRUNCATE TABLE silver.erp_invoice_client;
        PRINT '-- Inserting Data Into: silver.erp_invoice_client';
        INSERT INTO silver.erp_invoice_client (
            clientid,
            client_country,
            client_birth_dt,
            client_gender,
            client_account_status,
            client_segment
        )
        SELECT
            clientid,
            CASE WHEN client_country = '' THEN 'n/a'
                 ELSE client_country
            END AS client_country,
            CASE WHEN client_birth_dt > GETDATE() THEN NULL
                 ELSE CAST(client_birth_dt AS DATE)
            END AS client_birth_dt,
            CASE WHEN UPPER(client_gender) IN ('F', 'FEMALE') THEN 'Female'
                 WHEN UPPER(client_gender) IN ('M', 'MALE')   THEN 'Male'
                 ELSE 'n/a'
            END AS client_gender,
            CASE WHEN client_account_status = '' THEN 'n/a'
                 ELSE client_account_status
            END AS client_account_status,
            CASE WHEN client_segment = '' THEN 'n/a'
                 ELSE client_segment
            END AS client_segment
        FROM (
            SELECT
                *,
                ROW_NUMBER() OVER (PARTITION BY clientid ORDER BY client_birth_dt DESC) AS flag_last
            FROM bronze.erp_invoice_client
        ) t
        WHERE flag_last = 1;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        -- Load ERP product data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.erp_product_details';
        TRUNCATE TABLE silver.erp_product_details;
        PRINT '-- Inserting Data Into: silver.erp_product_details';
        INSERT INTO silver.erp_product_details (
            product_key,
            Product_category,
            Product_subcategory,
            Product_maintenance,
            product_level
        )
        SELECT
            product_key,
            CASE WHEN Product_category = '' THEN 'n/a'
                 ELSE Product_category
            END AS Product_category,
            CASE WHEN Product_subcategory = '' THEN 'n/a'
                 ELSE Product_subcategory
            END AS Product_subcategory,
            CASE WHEN Product_maintenance = '' THEN 'n/a'
                 ELSE Product_maintenance
            END AS Product_maintenance,
            product_level
        FROM bronze.erp_product_details;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        -- Load ERP transactions data:
        SET @start_time = GETDATE();
        PRINT '-- Truncating Table: silver.erp_invoice_transactions';
        TRUNCATE TABLE silver.erp_invoice_transactions;
        PRINT '-- Inserting Data Into: silver.erp_invoice_transactions';
        INSERT INTO silver.erp_invoice_transactions (
            invoice_id,
            invoice_ord_num,
            invoice_status,
            invoice_issue_dt
        )
        SELECT
            invoice_id,
            invoice_ord_num,
            CASE WHEN invoice_status = '' THEN 'n/a'
                 ELSE invoice_status
            END AS invoice_status,
            invoice_issue_dt
        FROM bronze.erp_invoice_transactions;
        SET @end_time = GETDATE();
        PRINT '-- Load Time: ' + CAST(DATEDIFF(SECOND, @start_time, @end_time) AS NVARCHAR) + ' seconds';

        PRINT '===============================================';
        -- All tables loaded, print the total time for the full batch run
        SET @batch_end_time = GETDATE();
        PRINT '-- Total Load Time: ' + CAST(DATEDIFF(SECOND, @batch_start_time, @batch_end_time) AS NVARCHAR) + ' seconds';
        PRINT '===============================================';

    -- Thrown errors: 
    END TRY
    BEGIN CATCH
        PRINT '===============================================';
        PRINT 'ERROR HAS OCCURED, WHEN LOADING SILVER LAYER';
        PRINT 'Error Message: ' + ERROR_MESSAGE();
        PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS NVARCHAR);
        PRINT 'Error State: '  + CAST(ERROR_STATE() AS NVARCHAR);
        PRINT '===============================================';
    END CATCH

END
