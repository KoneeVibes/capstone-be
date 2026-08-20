/**
 * @openapi
 * tags:
 *   - name: Invoice
 *     description: Endpoints for case invoices
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     caseId:
 *                       type: string
 *                       format: uuid
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         additionalProperties: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Server error while retrieving the invoice
 */
