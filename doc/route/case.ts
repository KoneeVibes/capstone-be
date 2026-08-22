/**
 * @openapi
 * tags:
 *   - name: Case
 *     description: Endpoints for creating and managing property inquiry cases
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       required:
 *         - id
 *         - source
 *         - applicantName
 *         - applicantEmail
 *         - applicantPhone
 *         - propertyCity
 *         - propertyState
 *         - propertyLGA
 *         - propertyAddress
 *         - propertyType
 *         - inquiryPurpose
 *         - propertyTitleType
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "7c8d3a65-6c09-489f-96d5-0f8454b5a8be"
 *         source:
 *           type: string
 *           enum:
 *             - website
 *             - mobile-app
 *             - third-party-api
 *           example: website
 *         assigneeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "31eb6fe4-af71-42a1-8522-788501201e22"
 *         applicantName:
 *           type: string
 *           example: Chinedu Okafor
 *         applicantEmail:
 *           type: string
 *           format: email
 *           example: chinedu.okafor@example.com
 *         applicantPhone:
 *           type: string
 *           example: "+2348012345678"
 *         propertyCity:
 *           type: string
 *           example: Ikeja
 *         propertyState:
 *           type: string
 *           example: Lagos
 *         propertyLGA:
 *           type: string
 *           example: Ikeja
 *         propertyAddress:
 *           type: string
 *           example: "12 Allen Avenue, Ikeja, Lagos"
 *         propertyType:
 *           type: string
 *           enum:
 *             - land
 *             - building
 *             - commercial
 *           example: land
 *         inquiryPurpose:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - due-diligence
 *               - physical-inspection
 *           example:
 *             - due-diligence
 *         propertyTitleType:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - certificate-of-occupancy
 *               - right-of-occupancy
 *               - deed-of-assignment
 *               - power-of-attorney
 *               - not-sure/seller-has-not-said
 *           example:
 *             - certificate-of-occupancy
 *         propertySurveyPlan:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - "https://res.cloudinary.com/demo/image/upload/survey-plan/example.jpg"
 *         propertyTitleDocument:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - "https://res.cloudinary.com/demo/image/upload/title-document/example.pdf"
 *         status:
 *           type: string
 *           enum:
 *             - submitted
 *             - assigned
 *             - accepted
 *             - pending-information
 *             - under-review
 *             - closed
 *             - suspended
 *           example: submitted
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/v1/case:
 *   post:
 *     tags:
 *       - Case
 *     summary: Create a property inquiry case
 *     description: Creates a case, uploads its supporting documents, and automatically generates a corresponding invoice.
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
 *                 example: Chinedu Okafor
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 example: chinedu.okafor@example.com
 *               applicantPhone:
 *                 type: string
 *                 example: "+2348012345678"
 *               propertyCity:
 *                 type: string
 *                 example: Ikeja
 *               propertyState:
 *                 type: string
 *                 example: Lagos
 *               propertyLGA:
 *                 type: string
 *                 example: Ikeja
 *               propertyAddress:
 *                 type: string
 *                 example: "12 Allen Avenue, Ikeja, Lagos"
 *               propertyType:
 *                 type: string
 *                 enum:
 *                   - land
 *                   - building
 *                   - commercial
 *                 example: land
 *               inquiryPurpose:
 *                 type: array
 *                 description: Use the display values below; the controller normalizes them before storage.
 *                 items:
 *                   type: string
 *                   enum:
 *                     - Due Diligence
 *                     - Physical Inspection
 *                 example:
 *                   - Due Diligence
 *               propertyTitleType:
 *                 type: array
 *                 description: Use the display values below; the controller normalizes them before storage.
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
 *                 enum:
 *                   - website
 *                   - mobile-app
 *                   - third-party-api
 *                 example: website
 *               propertySurveyPlan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Survey-plan files. JPG, JPEG, PNG, and PDF are accepted.
 *               propertyTitleDocument:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Property title-document files. JPG, JPEG, PNG, and PDF are accepted.
 *     responses:
 *       201:
 *         description: Case successfully created and invoice generated
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
 *                       example: "8c7ea90d-1e0e-4ceb-8882-43025863d3a2"
 *       400:
 *         description: Required fields are missing or invalid
 *       404:
 *         description: No price is configured for the selected location
 *       500:
 *         description: Server error while creating the case or generating its invoice
 *
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve all cases
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - submitted
 *               - assigned
 *               - accepted
 *               - pending-information
 *               - under-review
 *               - closed
 *         style: form
 *         explode: true
 *         description: One or more case statuses to include. Defaults to all active case statuses.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of cases per page.
 *     responses:
 *       200:
 *         description: Cases retrieved successfully
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
 *                     $ref: "#/components/schemas/Case"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     perPage:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       404:
 *         description: No cases found
 *       500:
 *         description: Server error while retrieving cases
 */

/**
 * @openapi
 * /api/v1/case/{caseId}:
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve one case
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The case application ID.
 *     responses:
 *       200:
 *         description: Case retrieved successfully
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
 *                   $ref: "#/components/schemas/Case"
 *       400:
 *         description: Case ID was not supplied
 *       404:
 *         description: Case not found
 *       500:
 *         description: Server error while retrieving the case
 *
 *   patch:
 *     tags:
 *       - Case
 *     summary: Update a case status or assignee
 *     description: Updates the supplied status and/or assigned staff member for an active case.
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The case application ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - submitted
 *                   - assigned
 *                   - accepted
 *                   - pending-information
 *                   - under-review
 *                   - closed
 *                   - suspended
 *                 example: assigned
 *               assigneeId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "31eb6fe4-af71-42a1-8522-788501201e22"
 *     responses:
 *       200:
 *         description: Case updated successfully
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
 *                   example: Case updated successfully.
 *                 data:
 *                   $ref: "#/components/schemas/Case"
 *       400:
 *         description: Case ID, status, or assignee is missing or invalid
 *       404:
 *         description: Case not found
 *       500:
 *         description: Server error while updating the case
 *
 *   delete:
 *     tags:
 *       - Case
 *     summary: Suspend a case
 *     description: Soft-deletes a case by changing its status to suspended.
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The case application ID.
 *     responses:
 *       200:
 *         description: Case suspended successfully
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
 *                   example: Case deleted successfully.
 *                 data:
 *                   $ref: "#/components/schemas/Case"
 *       400:
 *         description: Case ID was not supplied
 *       404:
 *         description: Case not found
 *       500:
 *         description: Server error while suspending the case
 */
