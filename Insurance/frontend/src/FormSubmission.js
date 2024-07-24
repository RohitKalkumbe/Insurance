import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

function FormSubmission() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const latestSubmissionRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  function changeHandler(e) {
    const { name, value } = e.target;

    if (
      name === "firstname" ||
      name === "lastname" ||
      name === "dob" ||
      name === "gender" ||
      name === "address"
    ) {
      setInput((prev) => ({ ...prev, [name]: value }));
      if (name === "dob") {
        calculateAge(value);
      }
    }

    if (name === "phonenumber") {
      setInput((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    }

    if (name === "email") {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setErrors((prev) => ({
        ...prev,
        dob: "Date of birth cannot be in the future",
      }));
      setAge(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setErrors((prev) => ({ ...prev, dob: null }));
    setAge(age);
  }

  async function onChangeSubmit(e) {
    e.preventDefault();
    const formErrors = {};

    if (!input.firstname) formErrors.firstname = "First name is required";
    if (!input.lastname) formErrors.lastname = "Last name is required";
    if (!input.phonenumber) formErrors.phonenumber = "Phone number is required";
    else if (input.phonenumber.length !== 10)
      formErrors.phonenumber = "Phone number must be 10 digits long";
    if (!input.email) formErrors.email = "Email is required";
    if (!validateEmail(input.email)) formErrors.email = "Invalid email address";
    if (!input.dob) formErrors.dob = "Date of birth is required";
    if (!input.gender) formErrors.gender = "Gender is required";
    if (!input.address) formErrors.address = "Address is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("All fields must be filled correctly before submitting the form.");
    } else {
      setErrors({});
      const newSubmission = { ...input, age };

      try {
        if (editIndex != null) {
          const response = await axios.put(
            `http://localhost:5000/submissions/${submissions[editIndex]._id}`,
            newSubmission
          );
          const updatedSubmissions = [...submissions];
          updatedSubmissions[editIndex] = response.data;
          setSubmissions(updatedSubmissions);
          setFilteredSubmissions(updatedSubmissions);
          setEditIndex(null);
        } else {
          const response = await axios.post(
            "http://localhost:5000/submissions",
            newSubmission
          );
          const updatedSubmissions = [response.data, ...submissions];
          setSubmissions(updatedSubmissions);
          setFilteredSubmissions(updatedSubmissions);
        }

        setSubmittedData(newSubmission);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
          gender: "",
          address: "",
        });
        setAge(null);

        // Show success message
        window.alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred while submitting the data.");
      }
    }
  }

  function handleEdit(index) {
    const entry = submissions[index];
    setInput({
      firstname: entry.firstname,
      lastname: entry.lastname,
      phonenumber: entry.phonenumber,
      email: entry.email,
      dob: entry.dob,
      gender: entry.gender,
      address: entry.address,
    });
    setAge(entry.age);
    setEditIndex(index);
  }

  async function handleDelete(index) {
    try {
      await axios.delete(
        `http://localhost:5000/submissions/${submissions[index]._id}`
      );
      const updatedSubmissions = submissions.filter((_, i) => i !== index);
      setSubmissions(updatedSubmissions);
      setFilteredSubmissions(updatedSubmissions);
      if (editIndex === index) {
        setEditIndex(null);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
          gender: "",
          address: "",
        });
        setAge(null);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting the data.");
    }
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/submissions");
        setSubmissions(response.data);
        setFilteredSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("An error occurred while fetching the submissions.");
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (latestSubmissionRef.current) {
      latestSubmissionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissions]);

  useEffect(() => {
    const filtered = submissions.filter((submission) =>
      `${submission.firstname} ${submission.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={onChangeSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                className="form-control"
                value={input.firstname}
                onChange={changeHandler}
              />
              {errors.firstname && (
                <div className="text-danger">{errors.firstname}</div>
              )}
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                className="form-control"
                value={input.lastname}
                onChange={changeHandler}
              />
              {errors.lastname && (
                <div className="text-danger">{errors.lastname}</div>
              )}
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phonenumber"
                className="form-control"
                value={input.phonenumber}
                onChange={changeHandler}
              />
              {errors.phonenumber && (
                <div className="text-danger">{errors.phonenumber}</div>
              )}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={input.email}
                onChange={changeHandler}
              />
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={input.dob}
                onChange={changeHandler}
              />
              {errors.dob && <div className="text-danger">{errors.dob}</div>}
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                className="form-control"
                value={input.gender}
                onChange={changeHandler}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <div className="text-danger">{errors.gender}</div>
              )}
            </div>
            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                className="form-control"
                value={input.address}
                onChange={changeHandler}
              />
              {errors.address && (
                <div className="text-danger">{errors.address}</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>

        <div className="col-md-6">
          <h3>All Submissions</h3>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredSubmissions.map((submission, index) => (
            <div
              key={index}
              className="mb-3"
              ref={
                index === submissions.length - 1 ? latestSubmissionRef : null
              }
            >
              <p>
                Full Name: {submission.firstname} {submission.lastname}
              </p>
              <p>Phone Number: {submission.phonenumber}</p>
              <p>Email: {submission.email}</p>
              <p>Date of Birth: {submission.dob}</p>
              <p>Gender: {submission.gender}</p>
              <p>Address: {submission.address}</p>
              <p>Age: {submission.age}</p>
              <button
                className="btn btn-secondary"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormSubmission;

/*import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

function FormSubmission() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    dob: "",
    gender: "",
    address: ""
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const latestSubmissionRef = useRef(null);

  function changeHandler(e) {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname" || name === "dob" || name === "gender" || name === "address") {
      setInput((prev) => ({ ...prev, [name]: value }));
      if (name === "dob") {
        calculateAge(value);
      }
    }

    if (name === "phonenumber") {
      setInput((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    }

    if (name === "email") {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setErrors((prev) => ({
        ...prev,
        dob: "Date of birth cannot be in the future",
      }));
      setAge(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setErrors((prev) => ({ ...prev, dob: null }));
    setAge(age);
  }

  async function onChangeSubmit(e) {
    e.preventDefault();
    const formErrors = {};

    if (!input.firstname) formErrors.firstname = "First name is required";
    if (!input.lastname) formErrors.lastname = "Last name is required";
    if (!input.phonenumber) formErrors.phonenumber = "Phone number is required";
    else if (input.phonenumber.length !== 10)
      formErrors.phonenumber = "Phone number must be 10 digits long";
    if (!input.email) formErrors.email = "Email is required";
    if (!validateEmail(input.email)) formErrors.email = "Invalid email address";
    if (!input.dob) formErrors.dob = "Date of birth is required";
    if (!input.gender) formErrors.gender = "Gender is required";
    if (!input.address) formErrors.address = "Address is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("All fields must be filled correctly before submitting the form.");
    } else {
      setErrors({});
      const newSubmission = { ...input, age };

      try {
        if (editIndex != null) {
          const response = await axios.put(`http://localhost:5000/submissions/${submissions[editIndex]._id}`, newSubmission);
          const updatedSubmissions = [...submissions];
          updatedSubmissions[editIndex] = response.data;
          setSubmissions(updatedSubmissions);
          setEditIndex(null);
        } else {
          const response = await axios.post("http://localhost:5000/submissions", newSubmission);
          setSubmissions([...submissions, response.data]);
        }

        setSubmittedData(newSubmission);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
          gender: "",
          address: ""
        });
        setAge(null);

        // Show success message
        window.alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred while submitting the data.");
      }
    }
  }

  function handleEdit(index) {
    const entry = submissions[index];
    setInput({
      firstname: entry.firstname,
      lastname: entry.lastname,
      phonenumber: entry.phonenumber,
      email: entry.email,
      dob: entry.dob,
      gender: entry.gender,
      address: entry.address
    });
    setAge(entry.age);
    setEditIndex(index);
    //formRef.current.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(index) {
    try {
      await axios.delete(`http://localhost:5000/submissions/${submissions[index]._id}`);
      const updatedSubmissions = submissions.filter((_, i) => i !== index);
      setSubmissions(updatedSubmissions);
      if (editIndex === index) {
        setEditIndex(null);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
          gender: "",
          address: ""
        });
        setAge(null);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting the data.");
    }
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/submissions");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("An error occurred while fetching the submissions.");
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (latestSubmissionRef.current) {
      latestSubmissionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissions]);

  return (
    <div className="container mt-5">
      <form onSubmit={onChangeSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={input.firstname}
            onChange={changeHandler}
          />
          {errors.firstname && (
            <div className="text-danger">{errors.firstname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={input.lastname}
            onChange={changeHandler}
          />
          {errors.lastname && (
            <div className="text-danger">{errors.lastname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            className="form-control"
            value={input.phonenumber}
            onChange={changeHandler}
          />
          {errors.phonenumber && (
            <div className="text-danger">{errors.phonenumber}</div>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={input.email}
            onChange={changeHandler}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            className="form-control"
            value={input.dob}
            onChange={changeHandler}
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            className="form-control"
            value={input.gender}
            onChange={changeHandler}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <div className="text-danger">{errors.gender}</div>}
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            className="form-control"
            value={input.address}
            onChange={changeHandler}
          />
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <div className="mt-5">
        <h3>All Submissions</h3>
        {submissions.map((submission, index) => (
          <div key={index} className="mb-3" ref={index === submissions.length - 1 ? latestSubmissionRef : null}>
            <p>Full Name: {submission.firstname} {submission.lastname}</p>
            <p>Phone Number: {submission.phonenumber}</p>
            <p>Email: {submission.email}</p>
            <p>Date of Birth: {submission.dob}</p>
            <p>Gender: {submission.gender}</p>
            <p>Address: {submission.address}</p>
            <p>Age: {submission.age}</p>
            <button className="btn btn-secondary" onClick={() => handleEdit(index)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormSubmission;
*/

/*import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

function FormSubmission() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    dob: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const latestSubmissionRef = useRef(null);

  function changeHandler(e) {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname" || name === "dob") {
      setInput((prev) => ({ ...prev, [name]: value }));
      if (name === "dob") {
        calculateAge(value);
      }
    }

    if (name === "phonenumber") {
      setInput((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    }

    if (name === "email") {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setErrors((prev) => ({
        ...prev,
        dob: "Date of birth cannot be in the future",
      }));
      setAge(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setErrors((prev) => ({ ...prev, dob: null }));
    setAge(age);
  }

  async function onChangeSubmit(e) {
    e.preventDefault();
    const formErrors = {};

    if (!input.firstname) formErrors.firstname = "First name is required";
    if (!input.lastname) formErrors.lastname = "Last name is required";
    if (!input.phonenumber) formErrors.phonenumber = "Phone number is required";
    else if (input.phonenumber.length !== 10)
      formErrors.phonenumber = "Phone number must be 10 digits long";
    if (!input.email) formErrors.email = "Email is required";
    if (!validateEmail(input.email)) formErrors.email = "Invalid email address";
    if (!input.dob) formErrors.dob = "Date of birth is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("All fields must be filled correctly before submitting the form.");
    } else {
      setErrors({});
      const newSubmission = { ...input, age };

      try {
        if (editIndex != null) {
          const response = await axios.put(`http://localhost:5000/submissions/${submissions[editIndex]._id}`, newSubmission);
          const updatedSubmissions = [...submissions];
          updatedSubmissions[editIndex] = response.data;
          setSubmissions(updatedSubmissions);
          setEditIndex(null);
        } else {
          const response = await axios.post("http://localhost:5000/submissions", newSubmission);
          setSubmissions([...submissions, response.data]);
        }

        setSubmittedData(newSubmission);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
        });
        setAge(null);

        // Show success message
        window.alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred while submitting the data.");
      }
    }
  }

  function handleEdit(index) {
    const entry = submissions[index];
    setInput({
      firstname: entry.firstname,
      lastname: entry.lastname,
      phonenumber: entry.phonenumber,
      email: entry.email,
      dob: entry.dob,
    });
    setAge(entry.age);
    setEditIndex(index);
    //formRef.current.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(index) {
    try {
      await axios.delete(`http://localhost:5000/submissions/${submissions[index]._id}`);
      const updatedSubmissions = submissions.filter((_, i) => i !== index);
      setSubmissions(updatedSubmissions);
      if (editIndex === index) {
        setEditIndex(null);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: "",
        });
        setAge(null);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("An error occurred while deleting the data.");
    }
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/submissions");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("An error occurred while fetching the submissions.");
      }
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (latestSubmissionRef.current) {
      latestSubmissionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissions]);

  return (
    <div className="container mt-5">
      <form onSubmit={onChangeSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={input.firstname}
            onChange={changeHandler}
          />
          {errors.firstname && (
            <div className="text-danger">{errors.firstname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={input.lastname}
            onChange={changeHandler}
          />
          {errors.lastname && (
            <div className="text-danger">{errors.lastname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            className="form-control"
            value={input.phonenumber}
            onChange={changeHandler}
          />
          {errors.phonenumber && (
            <div className="text-danger">{errors.phonenumber}</div>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={input.email}
            onChange={changeHandler}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            className="form-control"
            value={input.dob}
            onChange={changeHandler}
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <div className="mt-5">
        <h3>All Submissions</h3>
        {submissions.map((submission, index) => (
          <div key={index} className="mb-3" ref={index === submissions.length - 1 ? latestSubmissionRef : null}>
            <p>First Name: {submission.firstname}</p>
            <p>Last Name: {submission.lastname}</p>
            <p>Phone Number: {submission.phonenumber}</p>
            <p>Email: {submission.email}</p>
            <p>Date of Birth: {submission.dob}</p>
            <p>Age: {submission.age}</p>
            <button className="btn btn-secondary" onClick={() => handleEdit(index)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormSubmission;
*/
/*
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

function FormSubmission() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    dob: "", 
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null); 
  const [submissions, setSubmissions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);
  const latestSubmissionRef = useRef(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  function changeHandler(e) {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname" || name === "dob") {
      setInput((prev) => ({ ...prev, [name]: value }));
      if (name === "dob") {
        calculateAge(value);
      }
    }

    if (name === "phonenumber") {
      setInput((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    }

    if (name === "email") {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setErrors((prev) => ({
        ...prev,
        dob: "Date of birth cannot be in the future",
      }));
      setAge(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setErrors((prev) => ({ ...prev, dob: null }));
    setAge(age);
  }

  async function onChangeSubmit(e) {
    e.preventDefault();
    const formErrors = {};

    if (!input.firstname) formErrors.firstname = "First name is required";
    if (!input.lastname) formErrors.lastname = "Last name is required";
    if (!input.phonenumber) formErrors.phonenumber = "Phone number is required";
    else if (input.phonenumber.length !== 10)
      formErrors.phonenumber = "Phone number must be 10 digits long";
    if (!input.email) formErrors.email = "Email is required";
    if (!validateEmail(input.email)) formErrors.email = "Invalid email address";
    if (!input.dob) formErrors.dob = "Date of birth is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("All fields must be filled correctly before submitting the form.");
    } else {
      setErrors({});
      const newSubmission = { ...input, age };

      if (editIndex != null) {
        try {
          const response = await axios.put(`http://localhost:5000/submissions/${submissions[editIndex]._id}`, newSubmission);
          const updatedSubmissions = [...submissions];
          updatedSubmissions[editIndex] = response.data;
          setSubmissions(updatedSubmissions);
          setEditIndex(null);
        } catch (error) {
          console.error("Error updating submission", error);
        }
      } else {
        try {
          const response = await axios.post("http://localhost:5000/submissions", newSubmission);
          setSubmissions([...submissions, response.data]);
        } catch (error) {
          console.error("Error saving submission", error);
        }
      }

      setSubmittedData(newSubmission);
      setInput({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        dob: ""
      });
      setAge(null);
    }
  }

  async function handleEdit(index) {
    const entry = submissions[index];
    setInput({
      firstname: entry.firstname,
      lastname: entry.lastname,
      phonenumber: entry.phonenumber,
      email: entry.email,
      dob: entry.dob
    });
    setAge(entry.age);
    setEditIndex(index);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(index) {
    try {
      await axios.delete(`http://localhost:5000/submissions/${submissions[index]._id}`);
      const updatedSubmissions = submissions.filter((_, i) => i !== index);
      setSubmissions(updatedSubmissions);
      if (editIndex === index) {
        setEditIndex(null);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: ""
        });
        setAge(null);
      }
    } catch (error) {
      console.error("Error deleting submission", error);
    }
  }

  useEffect(() => {
    if (latestSubmissionRef.current) {
      latestSubmissionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissions]);

  return (
    <div className="container mt-5">
      <form onSubmit={onChangeSubmit} ref={formRef}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={input.firstname}
            onChange={changeHandler}
          />
          {errors.firstname && (
            <div className="text-danger">{errors.firstname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={input.lastname}
            onChange={changeHandler}
          />
          {errors.lastname && (
            <div className="text-danger">{errors.lastname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            className="form-control"
            value={input.phonenumber}
            onChange={changeHandler}
          />
          {errors.phonenumber && (
            <div className="text-danger">{errors.phonenumber}</div>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={input.email}
            onChange={changeHandler}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            className="form-control"
            value={input.dob}
            onChange={changeHandler}
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      
      <div className="mt-5">
        <h3>All Submissions</h3>
        {submissions.map((submission, index) => (
          <div key={index} className="mb-3" ref={index === submissions.length - 1 ? latestSubmissionRef : null}>
            <p> First Name: {submission.firstname}</p>
            <p> Last Name: {submission.lastname}</p>
            <p>Phone Number: {submission.phonenumber}</p>
            <p>Email: {submission.email}</p>
            <p>Date of Birth:{submission.dob}</p>
            <p>Age: {submission.age}</p>
            <button className="btn btn-secondary" onClick={() => handleEdit(index)}> Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormSubmission;
*/

/*
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

function FormSubmission() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    dob: "", 
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null); 
  const [submissions, setSubmissions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const formRef = useRef(null);
  const latestSubmissionRef = useRef(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions", error);
    }
  };

  function changeHandler(e) {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname" || name === "dob") {
      setInput((prev) => ({ ...prev, [name]: value }));
      if (name === "dob") {
        calculateAge(value);
      }
    }

    if (name === "phonenumber") {
      setInput((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    }

    if (name === "email") {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      setErrors((prev) => ({
        ...prev,
        dob: "Date of birth cannot be in the future",
      }));
      setAge(null);
      return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setErrors((prev) => ({ ...prev, dob: null }));
    setAge(age);
  }

  async function onChangeSubmit(e) {
    e.preventDefault();
    const formErrors = {};

    if (!input.firstname) formErrors.firstname = "First name is required";
    if (!input.lastname) formErrors.lastname = "Last name is required";
    if (!input.phonenumber) formErrors.phonenumber = "Phone number is required";
    else if (input.phonenumber.length !== 10)
      formErrors.phonenumber = "Phone number must be 10 digits long";
    if (!input.email) formErrors.email = "Email is required";
    if (!validateEmail(input.email)) formErrors.email = "Invalid email address";
    if (!input.dob) formErrors.dob = "Date of birth is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("All fields must be filled correctly before submitting the form.");
    } else {
      setErrors({});
      const newSubmission = { ...input, age };

      if (editIndex != null) {
        try {
          const response = await axios.put(`http://localhost:5000/submissions/${submissions[editIndex]._id}`, newSubmission);
          const updatedSubmissions = [...submissions];
          updatedSubmissions[editIndex] = response.data;
          setSubmissions(updatedSubmissions);
          setEditIndex(null);
        } catch (error) {
          console.error("Error updating submission", error);
        }
      } else {
        try {
          const response = await axios.post("http://localhost:5000/submissions", newSubmission);
          setSubmissions([...submissions, response.data]);
        } catch (error) {
          console.error("Error saving submission", error);
        }
      }

      setSubmittedData(newSubmission);
      setInput({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        dob: ""
      });
      setAge(null);
    }
  }

  async function handleEdit(index) {
    const entry = submissions[index];
    setInput({
      firstname: entry.firstname,
      lastname: entry.lastname,
      phonenumber: entry.phonenumber,
      email: entry.email,
      dob: entry.dob
    });
    setAge(entry.age);
    setEditIndex(index);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(index) {
    try {
      await axios.delete(`http://localhost:5000/submissions/${submissions[index]._id}`);
      const updatedSubmissions = submissions.filter((_, i) => i !== index);
      setSubmissions(updatedSubmissions);
      if (editIndex === index) {
        setEditIndex(null);
        setInput({
          firstname: "",
          lastname: "",
          phonenumber: "",
          email: "",
          dob: ""
        });
        setAge(null);
      }
    } catch (error) {
      console.error("Error deleting submission", error);
    }
  }

  useEffect(() => {
    if (latestSubmissionRef.current) {
      latestSubmissionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submissions]);

  return (
    <div className="container mt-5">
      <form onSubmit={onChangeSubmit} ref={formRef}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            className="form-control"
            value={input.firstname}
            onChange={changeHandler}
          />
          {errors.firstname && (
            <div className="text-danger">{errors.firstname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={input.lastname}
            onChange={changeHandler}
          />
          {errors.lastname && (
            <div className="text-danger">{errors.lastname}</div>
          )}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            className="form-control"
            value={input.phonenumber}
            onChange={changeHandler}
          />
          {errors.phonenumber && (
            <div className="text-danger">{errors.phonenumber}</div>
          )}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={input.email}
            onChange={changeHandler}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            className="form-control"
            value={input.dob}
            onChange={changeHandler}
          />
          {errors.dob && <div className="text-danger">{errors.dob}</div>}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      
      <div className="mt-5">
        <h3>All Submissions</h3>
        {submissions.map((submission, index) => (
          <div key={index} className="mb-3" ref={index === submissions.length - 1 ? latestSubmissionRef : null}>
            <p> First Name: {submission.firstname}</p>
            <p> Last Name: {submission.lastname}</p>
            <p>Phone Number: {submission.phonenumber}</p>
            <p>Email: {submission.email}</p>
            <p>Date of Birth:{submission.dob}</p>
            <p>Age: {submission.age}</p>
            <button className="btn btn-secondary" onClick={() => handleEdit(index)}> Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormSubmission;
*/
