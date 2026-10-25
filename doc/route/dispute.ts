/**
 * @swagger
 * /api/v1/dispute:
 *   post:
 *     tags:
 *       - Dispute
 *     summary: Initiate a dispute
 *     description: >
 *       Allows an authenticated registered client to open a dispute on their
 *       own case, provided the case is closed. A case may have only one open
 *       dispute at a time. Up to five JPG, JPEG, PNG, or PDF attachments may
 *       be uploaded. The configured file-size limit is 5 MB per file.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - caseId
 *               - title
 *               - description
 *             properties:
 *               caseId:
 *                 type: string
 *                 description: ID of the closed case being disputed.
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               attachment:
 *                 type: array
 *                 maxItems: 5
 *                 description: Optional supporting files.
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             attachment:
 *               contentType: image/jpeg, image/png, application/pdf
 *     responses:
 *       201:
 *         description: Dispute initiated successfully.
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
 *                   example: Dispute successfully initiated
 *       400:
 *         description: Required dispute details are missing, or the requester is not a registered client.
 *       401:
 *         description: Authentication is required.
 *       404:
 *         description: The case was not found, is not closed, or does not belong to the client.
 *       409:
 *         description: The case already has an open dispute.
 *       500:
 *         description: Server error while initiating the dispute.
 *
 * /api/v1/dispute/{disputeId}:
 *   get:
 *     tags:
 *       - Dispute
 *     summary: Retrieve a dispute
 *     description: Retrieves a dispute by its application ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
 *         required: true
 *         description: The dispute's application ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute retrieved successfully.
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
 *                   $ref: '#/components/schemas/Dispute'
 *       401:
 *         description: Authentication is required.
 *       404:
 *         description: Dispute not found.
 *       500:
 *         description: Server error while retrieving the dispute.
 *
 *   patch:
 *     tags:
 *       - Dispute
 *     summary: Reject an open dispute
 *     description: >
 *       Rejects an open dispute and records a rejection note. Requires the
 *       Dispute-module permission granted to the manager and regular roles.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disputeId
 *         required: true
 *         description: The dispute's application ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionNote
 *             properties:
 *               rejectionNote:
 *                 type: string
 *                 minLength: 1
 *                 description: Reason for rejecting the dispute.
 *     responses:
 *       200:
 *         description: Dispute rejected successfully.
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
 *                   example: Dispute rejected successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Dispute'
 *       400:
 *         description: Dispute ID or rejection note is missing or invalid.
 *       401:
 *         description: Authentication is required.
 *       403:
 *         description: The user does not have permission to reject disputes.
 *       404:
 *         description: No open dispute was found with this ID.
 *       500:
 *         description: Server error while rejecting the dispute.
 *
 * /api/v1/dispute/case/{caseId}:
 *   get:
 *     tags:
 *       - Dispute
 *     summary: Retrieve disputes for a case
 *     description: Retrieves a paginated list of disputes associated with the specified case ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         description: The case's application ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number, starting at 1.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: perPage
 *         required: false
 *         description: Number of disputes per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Case disputes retrieved successfully.
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dispute'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Case ID was not provided.
 *       401:
 *         description: Authentication is required.
 *       404:
 *         description: No disputes were found for this case and page.
 *       500:
 *         description: Server error while retrieving case disputes.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dispute:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Application-level dispute ID.
 *         caseId:
 *           type: string
 *           description: Application-level ID of the disputed case.
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         attachment:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             format: uri
 *         status:
 *           type: string
 *           enum:
 *             - open
 *             - accepted
 *             - rejected
 *         rejectionNote:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         perPage:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 */
