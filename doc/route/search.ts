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
 *
 *       Search history is saved only when saveToHistory is the string "true"
 *       and the current page returns at least one result. A repeated search
 *       with the same normalized query and flags updates the existing history
 *       record and sets its status to active.
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
 *         name: saveToHistory
 *         required: false
 *         description: >
 *           Pass the string "true" when the user commits the search, such as by
 *           pressing Enter or clicking Search. Omit it or pass "false" for
 *           live-search requests while the user is typing.
 *         schema:
 *           type: string
 *           enum:
 *             - "true"
 *             - "false"
 *           default: "false"
 *         example: "true"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       403:
 *         description: >
 *           The authenticated user is not allowed to use search, or a
 *           registered client requested a category other than case.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: No matching records were found on the requested page.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       500:
 *         description: Server error while searching or saving search history.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /api/v1/search/history:
 *   get:
 *     tags:
 *       - Search
 *     summary: Retrieve the authenticated user's search history
 *     description: >
 *       Returns active search history records for the authenticated user,
 *       ordered by most recently updated. The internal key and MongoDB
 *       document fields _id and __v are omitted. An empty history returns
 *       status 200 with an empty data array.
 *     operationId: retrieveSearchHistory
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *           Number of history records per page. Values are limited to 1–100.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Search history retrieved, including when it is empty.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchHistoryResponse'
 *       401:
 *         description: Authentication is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error while retrieving search history.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

/**
 * @swagger
 * /api/v1/search/history/{searchId}:
 *   delete:
 *     tags:
 *       - Search
 *     summary: Delete a search history record
 *     description: >
 *       Marks the authenticated user's search history record as inactive.
 *       Inactive records are excluded from search history retrieval. The
 *       record is not physically removed from the database.
 *     operationId: deleteSearchRecord
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchId
 *         required: true
 *         description: The application-level ID of the search history record.
 *         schema:
 *           type: string
 *         example: 4a60c17d-8725-45d8-ad1e-a89f26f340e4
 *     responses:
 *       200:
 *         description: Search history record marked inactive.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               status: success
 *               message: Search record deleted successfully.
 *       400:
 *         description: Search ID was not provided.
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
 *       404:
 *         description: Search record was not found for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error while deleting the search history record.
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
 *           examples:
 *             found:
 *               value: Search completed successfully.
 *             notFound:
 *               value: No matching records found.
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
 *           required:
 *             - page
 *             - perPage
 *           properties:
 *             page:
 *               type: integer
 *             perPage:
 *               type: integer
 *
 *     SearchHistoryResponse:
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
 *           example: Search history retrieved successfully.
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SearchHistoryRecord'
 *         meta:
 *           type: object
 *           required:
 *             - page
 *             - perPage
 *             - total
 *             - totalPages
 *           properties:
 *             page:
 *               type: integer
 *             perPage:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *
 *     SearchHistoryRecord:
 *       type: object
 *       description: >
 *         Active search history record. The key, MongoDB _id, and __v fields
 *         are omitted from the response.
 *       required:
 *         - id
 *         - requester
 *         - query
 *         - flag
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Application-level search record ID.
 *           example: 4a60c17d-8725-45d8-ad1e-a89f26f340e4
 *         requester:
 *           type: string
 *           description: ID of the user who made the search.
 *         query:
 *           type: string
 *           example: Lagos
 *         flag:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - case
 *               - staff
 *               - registered-client
 *               - guest-client
 *         status:
 *           type: string
 *           enum:
 *             - active
 *             - inactive
 *           example: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
