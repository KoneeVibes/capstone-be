/**
 * @openapi
 * tags:
 *   - name: Staff
 *     description: Endpoints for managing staff members
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "7c8d3a65-6c09-489f-96d5-0f8454b5a8be"
 *         firstName:
 *           type: string
 *           example: Ada
 *         middleName:
 *           type: string
 *           nullable: true
 *           example: Grace
 *         lastName:
 *           type: string
 *           example: Okafor
 *         email:
 *           type: string
 *           format: email
 *           example: ada.okafor@example.com
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "+2348012345678"
 *         avatar:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://res.cloudinary.com/demo/image/upload/v1610000000/avatar/example.jpg"
 *         role:
 *           type: string
 *           nullable: true
 *           example: Property Manager
 *         type:
 *           type: string
 *           example: staff
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
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         message:
 *           type: string
 */

/**
 * @openapi
 * /api/v1/staff:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Add a staff member
 *     description: Creates a new staff account with a system-generated ID and default password.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ada
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: Grace
 *               lastName:
 *                 type: string
 *                 example: Okafor
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada.okafor@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional staff profile image. Accepted formats are JPG, JPEG, and PNG.
 *     responses:
 *       201:
 *         description: Staff successfully added
 *       400:
 *         description: Required fields are missing or invalid
 *       409:
 *         description: A staff member with this email already exists
 *       500:
 *         description: Server error while creating staff
 *
 *   get:
 *     tags:
 *       - Staff
 *     summary: Retrieve all staff members
 *     parameters:
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
 *         description: Number of staff members per page.
 *     responses:
 *       200:
 *         description: Staff members retrieved successfully
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
 *                     $ref: "#/components/schemas/Staff"
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
 *         description: No staff members found
 *       500:
 *         description: Server error while retrieving staff members
 */

/**
 * @openapi
 * /api/v1/staff/{userId}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Retrieve one staff member
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The staff member application ID.
 *     responses:
 *       200:
 *         description: Staff member retrieved successfully
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
 *                   $ref: "#/components/schemas/Staff"
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Server error while retrieving the staff member
 *
 *   put:
 *     tags:
 *       - Staff
 *     summary: Update a staff member
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The staff member application ID.
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ada
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: Grace
 *               lastName:
 *                 type: string
 *                 example: Okafor
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada.okafor@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               role:
 *                 type: string
 *                 nullable: true
 *                 example: Property Manager
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement profile image. Accepted formats are JPG, JPEG, and PNG.
 *     responses:
 *       200:
 *         description: Staff member updated successfully
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
 *                   example: Staff member updated successfully.
 *                 data:
 *                   $ref: "#/components/schemas/Staff"
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Server error while updating the staff member
 *
 *   delete:
 *     tags:
 *       - Staff
 *     summary: Deactivate a staff member
 *     description: Soft-deletes a staff member by setting their status to inactive.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The staff member application ID.
 *     responses:
 *       200:
 *         description: Staff member deactivated successfully
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
 *                   example: Staff member deleted successfully.
 *                 data:
 *                   $ref: "#/components/schemas/Staff"
 *       404:
 *         description: Staff member not found
 *       500:
 *         description: Server error while deactivating the staff member
 */
