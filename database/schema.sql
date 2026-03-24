-- Islam Library POS - Full Schema
CREATE TABLE IF NOT EXISTS branches (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, is_main INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, role TEXT, branch_id INTEGER);
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, barcode TEXT UNIQUE, name TEXT, sale_price REAL, cost_price REAL, wholesale_price REAL, min_stock_level INTEGER);
CREATE TABLE IF NOT EXISTS branch_inventory (branch_id INTEGER, product_id INTEGER, quantity INTEGER, PRIMARY KEY (branch_id, product_id));
CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_no TEXT UNIQUE, branch_id INTEGER, user_id INTEGER, subtotal REAL, discount REAL, discount_type TEXT, grand_total REAL, payment_method TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sale_items (id INTEGER PRIMARY KEY AUTOINCREMENT, sale_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL, total_price REAL);
CREATE TABLE IF NOT EXISTS cash_drawer (branch_id INTEGER PRIMARY KEY, current_balance REAL DEFAULT 0);
CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, base_salary REAL);
CREATE TABLE IF NOT EXISTS salary_payments (id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INTEGER, amount REAL, payment_type TEXT, details TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT UNIQUE, loyalty_points INTEGER DEFAULT 0, segment TEXT DEFAULT 'regular');
CREATE TABLE IF NOT EXISTS archived_sales (id INTEGER PRIMARY KEY, invoice_no TEXT, summary_json TEXT);
CREATE VIEW IF NOT EXISTS daily_sales_summary AS SELECT date(created_at) as sale_date, branch_id, payment_method, SUM(grand_total) as total_revenue FROM sales GROUP BY sale_date, branch_id, payment_method;
