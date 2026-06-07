/*
================================================================
Bronze Layer -- Stored Procedure: Load Bronze
================================================================
Overview:
    Loads raw data from flat CSV files into the Bronze layer tables.
    Covers both CRM and ERP source systems.
    Each table is wiped clean before the new data is loaded in.
    Tracks how long each individual table load takes, plus the
    total time for the full batch.


    TRUNCATE runs before every load, existing Bronze data will
    be permanently wiped before new data comes in.
    CSV paths will need to be changed based on user specifics

    To execute the stored procedure, run the line below:
    EXEC bronze.load_bronze
================================================================
*/



CREATE OR ALTER PROCEDURE bronze.load_bronze AS
BEGIN
-- Runtime variables to track load durations, individual and full procedures
	DECLARE @start_time DATETIME, @end_time DATETIME, @batch_start_time DATETIME, @batch_end_time DATETIME;
-- Wrapped in a try/catch, debbuging
	BEGIN TRY
		-- time stamp for calculating how long the entire batch took to load 
		SET @batch_start_time = GETDATE();
		PRINT '===============================================';
		PRINT 'Loading the Bronze Layer';
		PRINT '===============================================';

	  -- ============================================================
    -- CRM TABLES
    -- ============================================================

		PRINT '===============================================';
		PRINT ' CRM Tables being loaded';
		PRINT '===============================================';

		-- Begin to load corresponding data associated with crm
		-- follows same patterns: truncate, bulk load data and print load time throughout

		-- Load CRM client data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.crm_client_info';
		TRUNCATE TABLE bronze.crm_client_info;
		BULK INSERT bronze.crm_client_info
		FROM 'C:\\your\\path\\here' 
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

		-- Load CRM product data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.crm_product_info';
		TRUNCATE TABLE bronze.crm_product_info;
		BULK INSERT bronze.crm_product_info
		FROM 'C:\\your\\path\\here'
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

		 -- Load CRM sales data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.crm_sales_info';
		TRUNCATE TABLE bronze.crm_sales_info;
		BULK INSERT bronze.crm_sales_info
		FROM 'C:\\your\\path\\here'
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

	  -- ============================================================
    -- ERP TABLES
    -- ============================================================

		PRINT '===============================================';
		PRINT ' ERP Tables being loaded';
		PRINT '===============================================';

		-- Load ERP client geography data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.erp_invoice_client';
		TRUNCATE TABLE bronze.erp_invoice_client;
		BULK INSERT bronze.erp_invoice_client
		FROM 'C:\\your\\path\\here'
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';
		
		-- Load ERP client info data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.erp_product_details';
		TRUNCATE TABLE bronze.erp_product_details;
		BULK INSERT bronze.erp_product_details
		FROM 'C:\\your\\path\\here'
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(second, @start_time, @end_time) AS NVARCHAR) + ' seconds';

		-- Load ERP product category data:
		SET @start_time = GETDATE();
		PRINT '-- Truncating Table: bronze.erp_invoice_transactions';
		TRUNCATE TABLE bronze.erp_invoice_transactions;
		BULK INSERT bronze.erp_invoice_transactions
		FROM 'C:\\your\\path\\here'
		WITH (
			FIRSTROW = 2,
			FIELDTERMINATOR = ',',
			TABLOCK
		);
		SET @end_time = GETDATE();
		PRINT '-- Load Time: ' + CAST (DATEDIFF(SECOND, @start_time, @end_time) AS NVARCHAR) + ' seconds';
		PRINT '===============================================';
		 -- All tables loaded, print the total time for the full batch run
		SET @batch_end_time = GETDATE();
		PRINT '-- Total Load Time: ' + CAST (DATEDIFF(SECOND, @batch_start_time, @batch_end_time) AS NVARCHAR) + ' seconds';
		PRINT '===============================================';

	-- Thrown errors: 
	END TRY
	BEGIN CATCH
		PRINT '===============================================';
		PRINT 'ERROR HAS OCCURED, WHEN LOADING BRONZE LAYER';
		PRINT 'Error Message' + ERROR_MESSAGE();
		PRINT 'Error Number' +  CAST (ERROR_NUMBER() AS NVARCHAR);
		PRINT 'Error Message' +  CAST (ERROR_STATE() AS NVARCHAR);
		PRINT '===============================================';
	END CATCH

END
