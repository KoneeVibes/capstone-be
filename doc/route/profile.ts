/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Retrieve the authenticated user's profile
 *     description: >
 *       Returns the profile of the authenticated user if the user account is
 *       active. The user is identified by the authenticated request; no user
 *       ID is supplied by the client. The response contains first name, middle
 *       name, last name, phone number, and avatar.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
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
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication is required or the authenticated user ID is missing.
 *       404:
 *         description: No active user profile was found for the authenticated user.
 *       500:
 *         description: Server error while retrieving the user profile.
 *
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update the authenticated user's profile
 *     description: >
 *       Updates one or more profile fields for the authenticated active user.
 *       The user is identified by the authenticated request; no user ID is
 *       supplied by the client. The request uses multipart/form-data so it can
 *       optionally include an avatar image. Accepted avatar formats are JPG,
 *       JPEG, and PNG. At least one profile field or an avatar file must be
 *       provided. Password, email, account type, role, organization, and
 *       account status cannot be changed through this endpoint.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 nullable: true
 *                 description: User's first name.
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 description: User's middle name.
 *               lastName:
 *                 type: string
 *                 nullable: true
 *                 description: User's last name.
 *               phone:
 *                 type: string
 *                 nullable: true
 *                 description: User's phone number.
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Optional JPG, JPEG, or PNG avatar image.
 *             example:
 *               firstName: Jane
 *               middleName: A.
 *               lastName: Doe
 *               phone: "+2348012345678"
 *     responses:
 *       200:
 *         description: User profile updated successfully.
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
 *                   example: User profile updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: No profile fields or avatar file were provided.
 *       401:
 *         description: Authentication is required or the authenticated user ID is missing.
 *       404:
 *         description: No active user profile was found for the authenticated user.
 *       500:
 *         description: Server error while updating the user profile.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           nullable: true
 *         middleName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: URL or path of the user's avatar.
 */
