/**
 * @openapi
 * tags:
 *   - name: Miscellaneous
 *     description: Miscellaneous application endpoints
 */

/**
 * @openapi
 * /api/v1/misc/location:
 *   get:
 *     tags:
 *       - Miscellaneous
 *     summary: Retrieve configured locations
 *     description: Returns all supported locations with their configured rates.
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                         example: Lagos
 *                       lga:
 *                         type: string
 *                         example: Eti-Osa
 *                       city:
 *                         type: string
 *                         example: Lekki
 *                       rate:
 *                         type: number
 *                         example: 150000
 */
