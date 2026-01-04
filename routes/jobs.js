const express = require('express')
const router = express.Router()

const {getAllJobs, getJob, createJob, updateJob, deleteJob} = require('../controllers/jobs')

/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: Get all jobs for the authenticated user
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobsResponse'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Job created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route('/').post(createJob).get(getAllJobs)

/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by id
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *   patch:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       200:
 *         description: Job updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 */
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router
