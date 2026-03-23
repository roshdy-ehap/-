const BaseRepository = require('./BaseRepository');
class SaleRepository extends BaseRepository {
    constructor() { super('sales'); }
    createSale(saleData, items) {
        const transaction = this.db.transaction(() => {
            const saleId = this.create(saleData);
            for (const item of items) {
                this.db.prepare(`INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)`).run(saleId, item.product_id, item.quantity, item.unit_price, item.total_price);
            }
            return saleId;
        });
        return transaction();
    }
}
module.exports = new SaleRepository();
