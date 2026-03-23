const { db } = require('../database');
const SaleRepository = require('../models/SaleRepository');
class SalesService {
    static processSale(saleData, items) {
        if (saleData.discount_type === 'percent') { saleData.grand_total = saleData.subtotal * (1 - saleData.discount / 100); }
        else if (saleData.discount_type === 'fixed') { saleData.grand_total = saleData.subtotal - saleData.discount; }
        const saleId = SaleRepository.createSale(saleData, items);
        if (saleData.payment_method === 'cash') {
            db.prepare(`UPDATE cash_drawer SET current_balance = current_balance + ? WHERE branch_id = ?`).run(saleData.grand_total, saleData.branch_id);
        }
        return saleId;
    }
}
module.exports = SalesService;
