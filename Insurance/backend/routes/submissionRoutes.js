const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

router.get("/", submissionController.getSubmissions);
router.post("/", submissionController.createSubmission);
router.put("/:id", submissionController.updateSubmission);
router.delete("/:id", submissionController.deleteSubmission);

module.exports = router;

/*
const express = require("express");
const router = express.Router();
const {
  getSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/submissionController");

router.get("/", getSubmissions);
router.post("/", createSubmission);
router.put("/:id", updateSubmission);
router.delete("/:id", deleteSubmission);

module.exports = router;
*/