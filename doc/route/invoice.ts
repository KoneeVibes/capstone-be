/**
 * @openapi
 * tags:
 *   - name: Invoice
 *     description: Endpoints for case invoices
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     InvoiceItem:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - unitPrice
 *       properties:
 *         name:
 *           type: string
 *           example: Due diligence fee
 *         description:
 *           type: string
 *           nullable: true
 *           example: Property due-diligence service charge.
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *         unitPrice:
 *           type: number
 *           minimum: 0
 *           example: 150000
 *     Invoice:
 *       type: object
 *       required:
 *         - id
 *         - caseId
 *         - items
 *         - totalPayable
 *         - currency
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "8c7ea90d-1e0e-4ceb-8882-43025863d3a2"
 *         caseId:
 *           type: string
 *           format: uuid
 *           example: "7c8d3a65-6c09-489f-96d5-0f8454b5a8be"
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: "#/components/schemas/InvoiceItem"
 *         totalPayable:
 *           type: number
 *           minimum: 0
 *           description: Calculated automatically from invoice item quantities and unit prices.
 *           example: 150000
 *         currency:
 *           type: string
 *           default: NGN
 *           example: NGN
 *         status:
 *           type: string
 *           enum:
 *             - unpaid
 *             - paid
 *             - refunded
 *           example: unpaid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/v1/invoice/{invoiceId}:
 *   get:
 *     tags:
 *       - Invoice
 *     summary: Retrieve an invoice
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The invoice application ID.
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: "#/components/schemas/Invoice"
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error while retrieving the invoice
 */
