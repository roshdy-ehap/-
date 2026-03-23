const { db } = require('../database');
class HRService {
    static addSalaryAdvance(employeeId, amount, details) {
        return db.prepare(`INSERT INTO salary_payments (employee_id, amount, payment_type, details) VALUES (?, ?, 'advance', ?)`).run(employeeId, amount, details);
    }
    static getEmployeeStatement(employeeId) {
        const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(employeeId);
        const payments = db.prepare('SELECT * FROM salary_payments WHERE employee_id = ?').all(employeeId);
        const totalAdvances = payments.filter(p => p.payment_type === 'advance').reduce((s, p) => s + p.amount, 0);
        return { ...employee, totalAdvances, netSalary: (employee.base_salary || 0) - totalAdvances };
    }
}
module.exports = HRService;
