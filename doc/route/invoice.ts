/**
 * @openapi
 * tags:
 *   - name: Invoice
 *     description: Endpoints for case invoices and payments
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
 *
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
 *           example: 8c7ea90d-1e0e-4ceb-8882-43025863d3a2
 *         caseId:
 *           type: string
 *           format: uuid
 *           example: 7c8d3a65-6c09-489f-96d5-0f8454b5a8be
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: "#/components/schemas/InvoiceItem"
 *         transactionAccessCode:
 *           type: string
 *           nullable: true
 *           description: Paystack access code created when payment settlement is initialized.
 *           example: 8e32fw8yx0t2uqs
 *         transactionReference:
 *           type: string
 *           nullable: true
 *           description: Unique Paystack transaction reference for this invoice.
 *           example: PI-9bd4181vzd
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
 *           default: unpaid
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
 *         description: The invoice ID.
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

/**
 * @openapi
 * /api/v1/invoice/settle/{invoiceId}:
 *   post:
 *     tags:
 *       - Invoice
 *     summary: Initialize invoice payment
 *     description: Initializes a Paystack transaction for an unpaid invoice and stores its access code and transaction reference.
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The invoice ID.
 *     responses:
 *       200:
 *         description: Settlement transaction initialized successfully
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
 *                   example: Settlement transaction has been initialized successfully
 *                 data:
 *                   type: object
 *                   required:
 *                     - accessCode
 *                     - reference
 *                   properties:
 *                     accessCode:
 *                       type: string
 *                       example: 8e32fw8yx0t2uqs
 *                     reference:
 *                       type: string
 *                       example: PI-9bd4181vzd
 *       400:
 *         description: Invoice ID was not supplied
 *       404:
 *         description: Invoice or linked case was not found, or payment initialization failed
 *       500:
 *         description: Server error while initializing the settlement transaction
 */
