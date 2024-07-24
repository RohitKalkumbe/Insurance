/*
const Submission = require("../models/submissionModel");

const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

const createSubmission = async (req, res) => {
  try {
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.json(newSubmission);
    console.log("Data inserted sucessfully");
  } catch (error) {
    res.status(500).json({ message: "Error saving submission" });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSubmission);
    console.log("Data updated sucessfully");
  } catch (error) {
    res.status(500).json({ message: "Error updating submission" });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: "Submission deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting submission" });
  }
};

module.exports = {
  getSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
};
*/
/*
const Submission = require("../models/submissionModel");

exports.getSubmissions = async (req, res) => {
  try {
    console.log("Fetching all submissions");
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    console.log("Creating new submission:", req.body);
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.json(newSubmission);
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ message: "Error saving submission" });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    console.log("Updating submission:", req.params.id, req.body);
    const updatedSubmission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ message: "Error updating submission" });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    console.log("Deleting submission:", req.params.id);
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Error deleting submission" });
  }
};
*/

const Submission = require("../models/submissionModel");

exports.getSubmissions = async (req, res) => {
  try {
    console.log("Fetching all submissions");
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    console.log("Creating new submission:", req.body);
    const newSubmission = new Submission(req.body);
    await newSubmission.save();
    res.json(newSubmission);
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ message: "Error saving submission" });
  }
};

exports.updateSubmission = async (req, res) => {
  try {
    console.log("Updating submission:", req.params.id, req.body);
    const updatedSubmission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ message: "Error updating submission" });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    console.log("Deleting submission:", req.params.id);
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: "Submission deleted" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Error deleting submission" });
  }
};
