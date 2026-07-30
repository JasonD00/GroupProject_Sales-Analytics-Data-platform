/*
 ============================================================
 DDL Script: Create Gold Layer - Star Schema
 ============================================================
 Script Purpose:
     Creates all dimensions and fact table for the Gold layer.
     Dimensions: dim_clients, dim_products, dim_territory,
                 dim_invoice_status
     Fact Table:  fact_sales
 ============================================================
*/

-- ============================================================
-- Dimension: gold.dim_clients
-- ============================================================
IF OBJECT_ID('gold.dim_clients', 'V') IS NOT NULL
    DROP VIEW gold.dim_clients;
GO
CREATE VIEW gold.dim_clients AS
SELECT
    ROW_NUMBER() OVER (ORDER BY ci.client_id) AS client_key,
    ci.client_id                               AS client_id,
    ci.client_key                              AS client_number,
    ci.client_firstname                        AS first_name,
    ci.client_lastname                         AS last_name,
    ci.client_marital_status                   AS marital_status,
    CASE WHEN ci.client_gender != 'n/a' THEN ci.client_gender
         ELSE COALESCE(ec.client_gender, 'n/a')
    END                                        AS gender,
    ec.client_country                          AS country,
    ec.client_birth_dt                         AS birth_date,
    ec.client_account_status                   AS account_status,
    ec.client_segment                          AS client_segment,
    ci.client_create_dt                        AS create_date
FROM silver.crm_client_info ci
LEFT JOIN silver.erp_invoice_client ec
    ON RIGHT(ci.client_key, 4) = RIGHT(ec.clientid, 4)
GO


-- ============================================================
-- Dimension: gold.dim_products
-- ============================================================
IF OBJECT_ID('gold.dim_products', 'V') IS NOT NULL
    DROP VIEW gold.dim_products;
GO
CREATE VIEW gold.dim_products AS
SELECT
    ROW_NUMBER() OVER (ORDER BY pi.prod_start_dt, pi.prod_key) AS product_key,
    pi.prod_id                                                  AS product_id,
    pi.prod_key                                                 AS product_number,
    pi.prod_nm                                                  AS product_name,
    pi.prod_cost                                                AS cost,
    pi.prod_type                                                AS product_type,
    pd.Product_category                                         AS category,
    pd.Product_subcategory                                      AS subcategory,
    pd.Product_maintenance                                      AS maintenance,
    pd.product_level                                            AS product_level,
    pi.prod_start_dt                                            AS start_date
FROM silver.crm_product_info pi
LEFT JOIN silver.erp_product_details pd
    ON pi.prod_key = pd.product_key
GO


-- ============================================================
-- Dimension: gold.dim_territory
-- ============================================================
IF OBJECT_ID('gold.dim_territory', 'V') IS NOT NULL
    DROP VIEW gold.dim_territory;
GO
CREATE VIEW gold.dim_territory AS
SELECT
    ROW_NUMBER() OVER (ORDER BY client_country, client_segment) AS territory_key,
    client_country                                               AS country,
    CASE WHEN client_segment = '' OR client_segment IS NULL THEN 'n/a'
         ELSE client_segment
    END                                                          AS client_segment
FROM (
    SELECT DISTINCT
        client_country,
        client_segment
    FROM silver.erp_invoice_client
) t
GO


-- ============================================================
-- Dimension: gold.dim_invoice_status
-- ============================================================
IF OBJECT_ID('gold.dim_invoice_status', 'V') IS NOT NULL
    DROP VIEW gold.dim_invoice_status;
GO
CREATE VIEW gold.dim_invoice_status AS
SELECT
    ROW_NUMBER() OVER (ORDER BY Invoice_status) AS invoice_status_key,
    CASE WHEN Invoice_status = '' OR Invoice_status IS NULL THEN 'n/a'
         ELSE Invoice_status
    END                                          AS invoice_status
FROM (
    SELECT DISTINCT Invoice_status
    FROM silver.erp_invoice_transactions
) t
GO


-- ============================================================
-- Fact Table: gold.fact_sales
-- ============================================================
IF OBJECT_ID('gold.fact_sales', 'V') IS NOT NULL
    DROP VIEW gold.fact_sales;
GO
CREATE VIEW gold.fact_sales AS
SELECT
    si.sales_ord_num        AS order_number,
    dc.client_key           AS client_key,
    dp.product_key          AS product_key,
    dt.territory_key        AS territory_key,
    dis.invoice_status_key  AS invoice_status_key,
    si.sales_order_dt       AS order_date,
    si.sales_ship_dt        AS ship_date,
    si.sales_due_dt         AS due_date,
    si.sales_sales          AS sales_amount,
    si.sales_quantity       AS quantity,
    si.sales_price          AS price
FROM silver.crm_sales_info si
LEFT JOIN gold.dim_clients dc
    ON si.sales_client_id = dc.client_id
LEFT JOIN gold.dim_products dp
    ON si.sales_prd_key = dp.product_number
LEFT JOIN gold.dim_territory dt
    ON dc.country = dt.country
    AND dc.client_segment = dt.client_segment
LEFT JOIN silver.erp_invoice_transactions it
    ON si.sales_ord_num = it.Invoice_ord_num
LEFT JOIN gold.dim_invoice_status dis
    ON it.Invoice_status = dis.invoice_status
GO
