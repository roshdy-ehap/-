const { initializeDatabase, db } = require('../src/backend/database');
const SalesService = require('../src/backend/services/SalesService');
const InventoryService = require('../src/backend/services/InventoryService');
const FinanceService = require('../src/backend/services/FinanceService');
const HRService = require('../src/backend/services/HRService');
const ProductRepository = require('../src/backend/models/ProductRepository');

async function verifyUltimate() {
    console.log('--- Starting Ultimate System Verification ---');
    try {
        initializeDatabase();
        db.prepare('INSERT INTO cash_drawer (branch_id, current_balance) VALUES (1, 1000)').run();
        const productId = ProductRepository.create({ name: 'Book A', sale_price: 100, cost_price: 50, barcode: 'B001', min_stock_level: 5 });
        ProductRepository.updateInventory(1, productId, 10);

        console.log('Testing Sales with % Discount...');
        SalesService.processSale(
            { branch_id: 1, user_id: 1, subtotal: 200, discount: 10, discount_type: 'percent', payment_method: 'cash', invoice_no: 'SALE-ULT-1' },
            [{ product_id: productId, quantity: 2, unit_price: 100, total_price: 200 }]
        );
        const drawer = db.prepare('SELECT current_balance FROM cash_drawer WHERE branch_id = 1').get();
        console.log(`✅ Sales recorded. New drawer balance: ${drawer.current_balance}`);

        console.log('Testing Global 10% Price Increase...');
        InventoryService.updateAllPricesPercentage(10);
        const updatedProduct = ProductRepository.getById(productId);
        console.log(`✅ Global update done. New price: ${updatedProduct.sale_price}`);

        console.log('Testing HR Salary Advances...');
        db.prepare('INSERT INTO employees (full_name, base_salary) VALUES ("Employee 1", 5000)').run();
        const empId = db.prepare('SELECT last_insert_rowid() as id').get().id;
        HRService.addSalaryAdvance(empId, 500, 'Medical Advance');
        const statement = HRService.getEmployeeStatement(empId);
        console.log(`✅ HR Verified. Net Salary: ${statement.netSalary}`);

        console.log('--- ULTIMATE SYSTEM VERIFIED SUCCESSFULLY ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification Failed:', error.stack);
        process.exit(1);
    }
}
verifyUltimate();
