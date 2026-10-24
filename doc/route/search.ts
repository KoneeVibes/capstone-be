/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search cases and users
 *     description: >
 *       Searches cases and user records using a search term. Staff may search
 *       cases, staff, registered clients, and guest clients. If staff omit
 *       flag, all four categories are searched; if they provide one or more
 *       flags, only the requested categories are searched. Registered clients
 *       may search cases only, and only cases associated with their email
 *       address. Other user types cannot use this endpoint.
 *
 *       For staff, super-admins can search all cases. Other staff can search
 *       submitted and payment-validated cases, plus cases whose status history
 *       includes their user ID.
 *     operationId: search
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Search term; must contain between 2 and 100 characters.
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         example: Lagos
 *       - in: query
 *         name: flag
 *         required: false
 *         description: >
 *           Search category. May be supplied more than once. Supported values
 *           are case, staff, registered-client, and guest-client. For staff,
 *           omitting this parameter searches all categories. For registered
 *           clients, omitting it searches cases only.
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - case
 *               - staff
 *               - registered-client
 *               - guest-client
 *         example:
 *           - case
 *           - staff
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
 *         description: >
 *           Maximum number of results per category. Values are limited to
 *           1–100.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Search completed with at least one matching result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: Search term or flag is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Authentication is required.
 *       403:
 *         description: >
 *           The authenticated user is not allowed to use search, or a
 *           registered client requested a category other than case.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: No matching records were found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       500:
 *         description: Server error while searching.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - data
 *         - meta
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Search completed successfully.
 *         data:
 *           type: object
 *           description: >
 *             Only keys for the categories searched are included. A category's
 *             value is an array of matching records.
 *           properties:
 *             cases:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 *             staff:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchUser'
 *             registeredClients:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchUser'
 *             guestClients:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchUser'
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             perPage:
 *               type: integer
 *
 *     SearchUser:
 *       type: object
 *       description: User result. Passwords are excluded from search results.
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *           nullable: true
 *         middleName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *         avatar:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         type:
 *           type: string
 *           enum:
 *             - staff
 *             - registered-client
 *             - guest-client
 *         role:
 *           type: string
 *           nullable: true
 *           enum:
 *             - super-admin
 *             - admin
 *             - manager
 *             - regular
 *         organization:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
