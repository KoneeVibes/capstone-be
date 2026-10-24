/**
 * @swagger
 * /api/v1/case:
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve cases
 *     description: >
 *       Returns cases visible to the authenticated user. Registered and guest
 *       clients are limited to cases matching their email address. Staff can
 *       retrieve submitted and payment-validated cases, plus cases whose
 *       status history includes their user ID. Super-admins can retrieve all
 *       cases. The filter parameter may be repeated to request multiple
 *       statuses.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filter
 *         required: false
 *         description: >
 *           One or more case statuses to include. Invalid values are ignored.
 *           If no valid statuses remain, all statuses are used.
 *         style: form
 *         explode: true
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
 *               - disputed
 *         example:
 *           - assigned
 *           - under-review
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
 *         description: Number of cases per page.
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
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Case'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Authentication is required.
 *       404:
 *         description: No cases were found for the requested page and filters.
 *       500:
 *         description: Server error while retrieving cases.
 *
 *   post:
 *     tags:
 *       - Case
 *     summary: Create a case
 *     description: >
 *       Creates a case and optionally uploads property survey plan and
 *       property title document files. This endpoint is publicly accessible.
 *       Accepted upload formats are JPG, JPEG, PNG, and PDF; the upload limit
 *       is 5 MB per file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - source
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
 *             properties:
 *               source:
 *                 type: string
 *                 enum:
 *                   - website
 *                   - mobile-app
 *                   - third-party-api
 *               applicantName:
 *                 type: string
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *               applicantPhone:
 *                 type: string
 *               propertyCity:
 *                 type: string
 *               propertyState:
 *                 type: string
 *               propertyLGA:
 *                 type: string
 *               propertyAddress:
 *                 type: string
 *               propertyType:
 *                 type: string
 *                 enum:
 *                   - land
 *                   - building
 *                   - commercial
 *               inquiryPurpose:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - due-diligence
 *                     - physical-inspection
 *               propertyTitleType:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - certificate-of-occupancy
 *                     - right-of-occupancy
 *                     - deed-of-assignment
 *                     - power-of-attorney
 *                     - not-sure/seller-has-not-said
 *               propertySurveyPlan:
 *                 type: array
 *                 description: Optional survey-plan files.
 *                 items:
 *                   type: string
 *                   format: binary
 *               propertyTitleDocument:
 *                 type: array
 *                 description: Optional property-title document files.
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             propertySurveyPlan:
 *               contentType: image/jpeg, image/png, application/pdf
 *             propertyTitleDocument:
 *               contentType: image/jpeg, image/png, application/pdf
 *     responses:
 *       201:
 *         description: Case created successfully.
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
 *                   $ref: '#/components/schemas/Case'
 *       400:
 *         description: Required case details are missing or invalid.
 *       500:
 *         description: Server error while creating the case.
 *
 * /api/v1/case/track/{trackingId}:
 *   get:
 *     tags:
 *       - Case
 *     summary: Track a case
 *     description: Retrieves case tracking information using its tracking ID. Authentication is not required.
 *     parameters:
 *       - in: path
 *         name: trackingId
 *         required: true
 *         description: The case tracking ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Case tracking information retrieved successfully.
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
 *                   $ref: '#/components/schemas/Case'
 *       404:
 *         description: Case not found.
 *       500:
 *         description: Server error while tracking the case.
 *
 * /api/v1/case/{caseId}:
 *   parameters:
 *     - in: path
 *       name: caseId
 *       required: true
 *       description: The case's application ID.
 *       schema:
 *         type: string
 *
 *   get:
 *     tags:
 *       - Case
 *     summary: Retrieve a case
 *     description: >
 *       Returns a case if it exists and is visible to the authenticated user.
 *       Registered and guest clients are limited to cases matching their email.
 *       Super-admins can retrieve all cases. Other users can retrieve submitted
 *       and payment-validated cases, plus cases whose status history includes
 *       their user ID.
 *     security:
 *       - BearerAuth: []
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
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Case'
 *       401:
 *         description: Authentication is required.
 *       404:
 *         description: Case not found or not visible to the user.
 *       500:
 *         description: Server error while retrieving the case.
 *
 *   patch:
 *     tags:
 *       - Case
 *     summary: Update a case or its assignment
 *     description: >
 *       Updates a case status, assigns or reassigns the case, or performs both
 *       actions when assigning. Assignment-only requests are restricted to
 *       super-admins, admins, and managers, and are allowed when the current
 *       status is payment-validated, assigned, or accepted. Reassigning a
 *       suspended case requires a super-admin. Setting status to assigned
 *       requires assigneeId. Do not provide assigneeId with accepted, closed,
 *       or disputed.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - assigned
 *                   - accepted
 *                   - closed
 *                   - disputed
 *               assigneeId:
 *                 type: string
 *                 description: >
 *                   Required when status is assigned. May also be supplied
 *                   alone to assign or reassign a case.
 *               propertySurveyPlan:
 *                 type: array
 *                 description: Optional survey-plan files.
 *                 items:
 *                   type: string
 *                   format: binary
 *               propertyTitleDocument:
 *                 type: array
 *                 description: Optional property-title document files.
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             propertySurveyPlan:
 *               contentType: image/jpeg, image/png, application/pdf
 *             propertyTitleDocument:
 *               contentType: image/jpeg, image/png, application/pdf
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
 *                   example: Case updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Case'
 *       400:
 *         description: Required update fields are missing or invalid.
 *       401:
 *         description: Authentication is required.
 *       403:
 *         description: The user is not permitted to perform the requested action.
 *       404:
 *         description: Case or assignee was not found.
 *       409:
 *         description: The requested status transition is not allowed, or the case changed before the update.
 *       500:
 *         description: Server error while updating the case.
 *
 *   put:
 *     tags:
 *       - Case
 *     summary: Submit or replace a case report
 *     description: >
 *       Uploads one or more inquiry report files and changes the case status
 *       to under-review. The case must be assigned to the authenticated user
 *       and have a status of accepted, under-review, or disputed. Accepts up
 *       to five inquiryReport files in JPG, JPEG, PNG, or PDF format.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - inquiryReport
 *             properties:
 *               inquiryReport:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 description: Report files to upload.
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             inquiryReport:
 *               contentType: image/jpeg, image/png, application/pdf
 *     responses:
 *       200:
 *         description: Report submitted successfully; the case status is under-review.
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
 *                   example: Case report submitted successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Case'
 *       400:
 *         description: Case ID, authenticated user, or report attachment is missing.
 *       401:
 *         description: Authentication is required.
 *       403:
 *         description: The user is not permitted to submit a report.
 *       404:
 *         description: Case not found, not assigned to the user, or report could not be submitted.
 *       500:
 *         description: Server error while submitting the report.
 *
 *   delete:
 *     tags:
 *       - Case
 *     summary: Delete a case
 *     description: Deletes the case identified by caseId.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Case deleted successfully.
 *       401:
 *         description: Authentication is required.
 *       403:
 *         description: The user is not permitted to delete cases.
 *       404:
 *         description: Case not found.
 *       500:
 *         description: Server error while deleting the case.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Case:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Application-level case ID.
 *         trackingId:
 *           type: string
 *         source:
 *           type: string
 *           enum:
 *             - website
 *             - mobile-app
 *             - third-party-api
 *         assigneeId:
 *           type: string
 *           nullable: true
 *         applicantName:
 *           type: string
 *         applicantEmail:
 *           type: string
 *           format: email
 *         applicantPhone:
 *           type: string
 *         propertyCity:
 *           type: string
 *         propertyState:
 *           type: string
 *         propertyLGA:
 *           type: string
 *         propertyAddress:
 *           type: string
 *         propertyType:
 *           type: string
 *           enum:
 *             - land
 *             - building
 *             - commercial
 *         inquiryPurpose:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - due-diligence
 *               - physical-inspection
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
 *         propertySurveyPlan:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *         propertyTitleDocument:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
 *         inquiryReport:
 *           type: array
 *           nullable: true
 *           items:
 *             type: string
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
 *             - disputed
 *         statusHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               changedAt:
 *                 type: string
 *                 format: date-time
 *               assigneeId:
 *                 type: string
 *                 nullable: true
 *               note:
 *                 type: string
 *                 nullable: true
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
