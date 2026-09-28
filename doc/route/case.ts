/**
 * @openapi
 * tags:
 *   - name: Case
 *     description: Endpoints for creating, managing, and tracking property inquiry cases
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CaseStatusHistory:
 *       type: object
 *       required:
 *         - status
 *         - changedAt
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - submitted
 *             - payment-validated
 *             - assigned
 *             - accepted
 *             - pending-information
 *             - under-review
 *             - closed
 *             - suspended
 *           example: payment-validated
 *         changedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-09-07T10:30:00.000Z"
 *         assigneeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "31eb6fe4-af71-42a1-8522-788501201e22"
 *         note:
 *           type: string
 *           nullable: true
 *           example: Payment was successfully validated.
 *
 *     Case:
 *       type: object
 *       required:
 *         - id
 *         - trackingId
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
 *         trackingId:
 *           type: string
 *           description: Unique public tracking identifier for the case.
 *           example: PI-8K4M2Q
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
 *             - https://res.cloudinary.com/demo/image/upload/survey-plan/example.jpg
 *         propertyTitleDocument:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - https://res.cloudinary.com/demo/image/upload/title-document/example.pdf
 *         status:
 *           type: string
 *           enum:
 *             - submitted
 *             - payment-validated
 *             - assigned
 *             - accepted
 *             - pending-information
 *             - under-review
 *             - closed
 *             - suspended
 *           default: submitted
 *           example: submitted
 *         statusHistory:
 *           type: array
 *           description: Chronological history of status changes for the case.
 *           items:
 *             $ref: "#/components/schemas/CaseStatusHistory"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CaseTracking:
 *       type: object
 *       required:
 *         - trackingId
 *         - status
 *         - statusHistory
 *         - updatedAt
 *       properties:
 *         trackingId:
 *           type: string
 *           example: PI-8K4M2Q
 *         status:
 *           type: string
 *           enum:
 *             - submitted
 *             - payment-validated
 *             - assigned
 *             - accepted
 *             - pending-information
 *             - under-review
 *             - closed
 *             - suspended
 *           example: payment-validated
 *         statusHistory:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CaseStatusHistory"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-09-07T10:30:00.000Z"
 */

/**
 * @openapi
 * /api/v1/case:
 *   post:
 *     tags:
 *       - Case
 *     summary: Create a property inquiry case
 *     description: Public endpoint. Creates a case, uploads supporting documents, generates an invoice, and returns a public tracking ID.
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
 *                 example: 12 Allen Avenue, Ikeja, Lagos
 *               propertyType:
 *                 type: string
 *                 enum: [land, building, commercial]
 *                 example: land
 *               inquiryPurpose:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Due Diligence, Physical Inspection]
 *                 example: [Due Diligence]
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
 *                 example: [Certificate of Occupancy]
 *               source:
 *                 type: string
 *                 enum: [website, mobile-app, third-party-api]
 *                 example: website
 *               propertySurveyPlan:
 *                 type: array
 *                 description: Survey-plan files. JPG, JPEG, PNG, and PDF are accepted.
 *                 items:
 *                   type: string
 *                   format: binary
 *               propertyTitleDocument:
 *                 type: array
 *                 description: Title-document files. JPG, JPEG, PNG, and PDF are accepted.
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Case successfully created and invoice generated.
 *       400:
 *         description: Required fields are missing or invalid.
 *       404:
 *         description: No price is configured for the selected location.
 *       500:
 *         description: Server error while creating the case or generating its invoice.
 *
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve cases
 *     description: "Requires authentication. Staff users can retrieve all cases permitted by the controller query. Registered-client and guest-client users receive only cases scoped to their email address."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - submitted
 *               - payment-validated
 *               - assigned
 *               - accepted
 *               - pending-information
 *               - under-review
 *               - closed
 *               - suspended
 *         style: form
 *         explode: true
 *         description: One or more case statuses to include.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Cases retrieved successfully.
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
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Case"
 *                 meta:
 *                   type: object
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       404:
 *         description: No cases found.
 *       500:
 *         description: Server error while retrieving cases.
 */

/**
 * @openapi
 * /api/v1/case/track/{trackingId}:
 *   get:
 *     tags:
 *       - Case
 *     summary: Track a case by tracking ID
 *     description: Public endpoint. Retrieves tracking details without exposing applicant data.
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         required: true
 *         schema:
 *           type: string
 *         example: PI-8K4M2Q
 *         description: The public case tracking ID.
 *     responses:
 *       200:
 *         description: Case tracking details retrieved successfully.
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
 *                 data:
 *                   $ref: "#/components/schemas/CaseTracking"
 *       400:
 *         description: Tracking ID was not supplied.
 *       404:
 *         description: Case not found.
 *       500:
 *         description: Server error while retrieving tracking details.
 */

/**
 * @openapi
 * /api/v1/case/{caseId}:
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve one case
 *     description: "Requires authentication. Staff users may retrieve a case permitted by the controller. Registered-client and guest-client users may retrieve only cases scoped to their email address."
 *     security:
 *       - BearerAuth: []
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
 *         description: Case retrieved successfully.
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
 *                 data:
 *                   $ref: "#/components/schemas/Case"
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       404:
 *         description: Case not found or is outside the authenticated client's scope.
 *       500:
 *         description: Server error while retrieving the case.
 *
 *   patch:
 *     tags:
 *       - Case
 *     summary: Update a case
 *     description: "Requires authentication and Case permission. Available only to permitted staff roles: super-admin, admin, manager, and regular."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                   - payment-validated
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
 *                 example: 31eb6fe4-af71-42a1-8522-788501201e22
 *     responses:
 *       200:
 *         description: Case updated successfully.
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
 *                 data:
 *                   $ref: "#/components/schemas/Case"
 *       400:
 *         description: Case ID, status, or assignee is missing or invalid.
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: The authenticated user does not have permission to update cases.
 *       404:
 *         description: Case not found.
 *       500:
 *         description: Server error while updating the case.
 *
 *   delete:
 *     tags:
 *       - Case
 *     summary: Suspend a case
 *     description: "Requires authentication and Case permission. Available only to the super-admin role."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Case suspended successfully.
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
 *                 data:
 *                   $ref: "#/components/schemas/Case"
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: Only a super-admin may suspend a case.
 *       404:
 *         description: Case not found.
 *       500:
 *         description: Server error while suspending the case.
 */
