const { db } = require('../database');
class FinanceService {
    static getDayClosingReport(branchId, date) {
        const salesSummary = db.prepare(`SELECT payment_method, SUM(grand_total) as total, COUNT(*) as count FROM sales WHERE branch_id = ? AND date(created_at) = ? GROUP BY payment_method`).all(branchId, date);
        const drawer = db.prepare('SELECT current_balance FROM cash_drawer WHERE branch_id = ?').get(branchId);
        return { salesSummary, drawerBalance: drawer ? drawer.current_balance : 0 };
    }
}
module.exports = FinanceService;
