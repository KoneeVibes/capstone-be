/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Endpoints for account registration, authentication, password reset, OTP verification, and signout.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthErrorResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         message:
 *           type: string
 *
 *     SignInResponse:
 *       type: object
 *       required:
 *         - status
 *         - token
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         token:
 *           type: string
 *           description: "JWT access token. Send this token as `Authorization: Bearer <token>` for protected routes."
 *
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
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
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "+2348012345678"
 *         organization:
 *           type: string
 *           nullable: true
 *           example: PropertyIntel Partners
 *
 *     VerifyOtpUserDetails:
 *       type: object
 *       description: Required when completing a sign-up for an account with missing profile information. For password reset, provide password and confirmPassword.
 *       properties:
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
 *         password:
 *           type: string
 *           format: password
 *           example: NewSecurePassword123!
 *         confirmPassword:
 *           type: string
 *           format: password
 *           example: NewSecurePassword123!
 *
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - otpType
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: ada.okafor@example.com
 *         otp:
 *           type: string
 *           description: Six-digit OTP sent to the email address.
 *           example: "123456"
 *         otpType:
 *           type: string
 *           enum:
 *             - sign-up
 *             - password-reset
 *           example: sign-up
 *         user:
 *           $ref: "#/components/schemas/VerifyOtpUserDetails"
 */

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a client account
 *     description: Creates a registered-client account and sends a sign-up OTP. If an inactive account already exists without an active OTP, a new sign-up OTP is sent instead.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SignUpRequest"
 *     responses:
 *       201:
 *         description: Registered client created and sign-up OTP sent.
 *       200:
 *         description: Existing inactive client found and sign-up OTP sent.
 *       400:
 *         description: Required or optional user fields are invalid.
 *       409:
 *         description: An active account or an existing unverified OTP already exists for this email.
 *       500:
 *         description: Server error while creating the client account.
 */

/**
 * @openapi
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign in
 *     description: Authenticates an active user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada.okafor@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: User signed in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SignInResponse"
 *       400:
 *         description: Email or password is missing.
 *       401:
 *         description: Incorrect password.
 *       404:
 *         description: Active user account not found.
 *       500:
 *         description: Server error while signing in.
 */

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request a password-reset OTP
 *     description: Sends a password-reset OTP to an active user's email address. Only one outstanding OTP is permitted per email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ada.okafor@example.com
 *     responses:
 *       201:
 *         description: Password-reset OTP sent successfully.
 *       400:
 *         description: Email is missing.
 *       409:
 *         description: Email is invalid, inactive, or already has an outstanding OTP.
 *       500:
 *         description: Server error while sending the password-reset OTP.
 */

/**
 * @openapi
 * /api/v1/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify an OTP
 *     description: Verifies a sign-up or password-reset OTP. A valid sign-up OTP activates the account. A valid password-reset OTP updates the user's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VerifyOtpRequest"
 *     responses:
 *       200:
 *         description: OTP successfully verified and the related account action completed.
 *       400:
 *         description: Invalid request details, OTP mismatch, password mismatch, incomplete sign-up information, or inactive account password-reset request.
 *       404:
 *         description: User account not found.
 *       409:
 *         description: OTP was not found or has expired.
 *       500:
 *         description: Server error while verifying the OTP.
 */

/**
 * @openapi
 * /api/v1/auth/signout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign out
 *     description: Invalidates the current JWT token for the lifetime of the in-memory token blacklist.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User signed out successfully.
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
 *                   example: Logged out successfully
 *       401:
 *         description: Missing, invalid, expired, or blacklisted bearer token.
 *       500:
 *         description: Server error while signing out.
 */
