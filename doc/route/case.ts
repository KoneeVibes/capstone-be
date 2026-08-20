/**
 * @openapi
 * tags:
 *   - name: Case
 *     description: Endpoints for property cases
 */

/**
 * @openapi
 * /api/v1/case:
 *   post:
 *     tags:
 *       - Case
 *     summary: Add a property case
 *     description: Creates a case, uploads the supporting documents, and generates an invoice.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - applicantName
 *               - applicantEmail
 *               - applicantPhone
 *               - propertyCity
 *               - propertyState
 *               - propertyLGA
 *               - propertyAddress
 *               - propertyType
 *               - inquiryPurpose
 *               - propertyTitleType
 *               - source
 *               - propertySurveyPlan
 *               - propertyTitleDocument
 *             properties:
 *               applicantName:
 *                 type: string
 *                 example: Ada Okafor
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 example: ada.okafor@example.com
 *               applicantPhone:
 *                 type: string
 *                 example: "+2348012345678"
 *               propertyCity:
 *                 type: string
 *                 example: Lekki
 *               propertyState:
 *                 type: string
 *                 example: Lagos
 *               propertyLGA:
 *                 type: string
 *                 example: Eti-Osa
 *               propertyAddress:
 *                 type: string
 *                 example: 12 Admiralty Way, Lekki Phase 1
 *               propertyType:
 *                 type: string
 *                 example: Residential
 *               inquiryPurpose:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Due Diligence
 *                     - Physical Inspection
 *                 example:
 *                   - Due Diligence
 *               propertyTitleType:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Certificate of Occupancy
 *                     - Right of Occupancy
 *                     - Deed of Assignment
 *                     - Power of Attorney
 *                     - Not sure / seller hasn't said
 *                 example:
 *                   - Certificate of Occupancy
 *               source:
 *                 type: string
 *                 example: Website
 *               propertySurveyPlan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Survey plan files. Accepted formats are JPG, JPEG, PNG, and PDF.
 *               propertyTitleDocument:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Title-document files. Accepted formats are JPG, JPEG, PNG, and PDF.
 *     responses:
 *       201:
 *         description: Case successfully added and invoice generated
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
 *                   example: Case successfully added
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoiceId:
 *                       type: string
 *                       format: uuid
 *                       example: 7c8d3a65-6c09-489f-96d5-0f8454b5a8be
 *       400:
 *         description: Required fields are missing or invoice generation failed
 *       404:
 *         description: No price is configured for the supplied location
 *       500:
 *         description: Server error while adding the case
 */
