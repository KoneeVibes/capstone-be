/**
 * @swagger
 * /api/v1/dashboard/metrics:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Retrieve dashboard metrics
 *     description: >
 *       Retrieves metrics for the authenticated staff member or client.
 *
 *       Staff receive queue and recent metrics. Queue counts cases assigned
 *       to the staff member. For super-admins, it also includes all cases
 *       currently under review. Recent counts cases with at least one status
 *       history entry assigned to the staff member during the last seven days.
 *
 *       Registered and guest clients receive case counts scoped to their
 *       authenticated email address. totalSearches counts all matching cases,
 *       regardless of status. reportsReady counts closed cases. inProgress
 *       counts cases with status payment-validated, assigned, accepted,
 *       under-review, pending-information, or disputed. needsYourInput counts
 *       pending-information cases.
 *     operationId: retrieveMetrics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardMetricsResponse'
 *             examples:
 *               staff:
 *                 summary: Staff metrics
 *                 value:
 *                   status: success
 *                   message: System metrics retrieved successfully.
 *                   data:
 *                     queue: 12
 *                     recent: 4
 *                   meta:
 *                     recentSince: "2026-10-25T10:30:00.000Z"
 *                     asOf: "2026-11-01T10:30:00.000Z"
 *               client:
 *                 summary: Client metrics
 *                 value:
 *                   status: success
 *                   message: System metrics retrieved successfully.
 *                   data:
 *                     totalSearches: 8
 *                     reportsReady: 2
 *                     inProgress: 5
 *                     needsYourInput: 1
 *       400:
 *         description: Required authenticated user details are missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       403:
 *         description: The authenticated user type is not allowed to retrieve metrics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error while retrieving dashboard metrics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardMetricsResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - data
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: System metrics retrieved successfully.
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/StaffDashboardMetrics'
 *             - $ref: '#/components/schemas/ClientDashboardMetrics'
 *         meta:
 *           $ref: '#/components/schemas/StaffDashboardMetricsMeta'
 *
 *     StaffDashboardMetrics:
 *       type: object
 *       required:
 *         - queue
 *         - recent
 *       properties:
 *         queue:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Cases assigned to the authenticated staff member. For
 *             super-admins, also includes all cases with status under-review.
 *           example: 12
 *         recent:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Cases with at least one status-history entry assigned to the
 *             authenticated staff member during the last seven days.
 *           example: 4
 *
 *     ClientDashboardMetrics:
 *       type: object
 *       required:
 *         - totalSearches
 *         - reportsReady
 *         - inProgress
 *         - needsYourInput
 *       properties:
 *         totalSearches:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Count of all cases whose applicantEmail matches the authenticated
 *             client's email, regardless of case status.
 *           example: 8
 *         reportsReady:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Count of matching client cases with status closed.
 *           example: 2
 *         inProgress:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Count of matching client cases with status payment-validated,
 *             assigned, accepted, under-review, pending-information, or disputed.
 *           example: 5
 *         needsYourInput:
 *           type: integer
 *           minimum: 0
 *           description: >
 *             Count of matching client cases with status pending-information.
 *           example: 1
 *
 *     StaffDashboardMetricsMeta:
 *       type: object
 *       description: Returned with staff metrics to indicate the recent-count window.
 *       required:
 *         - recentSince
 *         - asOf
 *       properties:
 *         recentSince:
 *           type: string
 *           format: date-time
 *           description: Start of the seven-day recent-count window.
 *           example: "2026-10-25T10:30:00.000Z"
 *         asOf:
 *           type: string
 *           format: date-time
 *           description: Time at which the metrics were calculated.
 *           example: "2026-11-01T10:30:00.000Z"
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         message:
 *           type: string
 */
