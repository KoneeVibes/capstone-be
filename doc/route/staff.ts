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
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *         - type
 *         - status
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
 *           example: "https://res.cloudinary.com/demo/image/upload/avatar/example.jpg"
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - manager
 *             - regular
 *           example: manager
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
 *     description: "Requires authentication and Staff permission. Available only to super-admin and admin roles."
 *     security:
 *       - BearerAuth: []
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
 *               - role
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
 *                 enum: [admin, manager, regular]
 *                 example: manager
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional JPG, JPEG, or PNG profile image.
 *     responses:
 *       201:
 *         description: Staff member successfully added.
 *       400:
 *         description: Required fields are missing or invalid.
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: Only super-admin and admin may add staff members.
 *       409:
 *         description: A staff member with this email already exists.
 *       500:
 *         description: Server error while creating staff.
 *
 *   get:
 *     tags:
 *       - Staff
 *     summary: Retrieve all staff members
 *     description: "Requires authentication and Staff permission. Available only to super-admin, admin, and manager roles."
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *         description: Staff members retrieved successfully.
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
 *                     $ref: "#/components/schemas/Staff"
 *                 meta:
 *                   type: object
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: Only super-admin, admin, and manager may retrieve all staff members.
 *       404:
 *         description: No staff members found.
 *       500:
 *         description: Server error while retrieving staff members.
 */

/**
 * @openapi
 * /api/v1/staff/{userId}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Retrieve one staff member
 *     description: "Requires authentication and Staff permission. Super-admin, admin, and manager may retrieve any staff profile. A regular staff user may retrieve only their own profile."
 *     security:
 *       - BearerAuth: []
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
 *         description: Staff member retrieved successfully.
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
 *                   $ref: "#/components/schemas/Staff"
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: A regular staff user may retrieve only their own profile.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Server error while retrieving the staff member.
 *
 *   put:
 *     tags:
 *       - Staff
 *     summary: Update a staff member
 *     description: "Requires authentication and Staff permission. Super-admin, admin, and manager may update any staff profile. A regular staff user may update only their own profile."
 *     security:
 *       - BearerAuth: []
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
 *                 enum: [admin, manager, regular]
 *                 example: manager
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional replacement JPG, JPEG, or PNG profile image.
 *     responses:
 *       200:
 *         description: Staff member updated successfully.
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
 *                   $ref: "#/components/schemas/Staff"
 *       400:
 *         description: No update fields were provided or a supplied field is invalid.
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: A regular staff user may update only their own profile.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Server error while updating the staff member.
 *
 *   delete:
 *     tags:
 *       - Staff
 *     summary: Deactivate a staff member
 *     description: "Requires authentication and Staff permission. Available only to the super-admin role. Soft-deletes the account by setting its status to inactive."
 *     security:
 *       - BearerAuth: []
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
 *         description: Staff member deactivated successfully.
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
 *                   $ref: "#/components/schemas/Staff"
 *       401:
 *         description: Authentication is missing, invalid, expired, or blacklisted.
 *       403:
 *         description: Only a super-admin may deactivate staff members.
 *       404:
 *         description: Staff member not found.
 *       500:
 *         description: Server error while deactivating the staff member.
 */
