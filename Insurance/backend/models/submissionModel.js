const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phonenumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model("Submission", submissionSchema);



/*
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phonenumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Submission", submissionSchema);
*/
/*
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phonenumber: String,
  email: String,
  dob: String,
  age: Number,
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
*/