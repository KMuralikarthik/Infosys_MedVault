import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";


import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080",
});

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [email, setEmail] = useState(localStorage.getItem("email"));
    const role = localStorage.getItem("role");
    const [isRegister, setIsRegister] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [doctors, setDoctors] = useState([]);


    const [doctorData, setDoctorData] = useState({
        name: "",
        specialization: "",
        experienceYears: "",
        hospitalName: ""
    });



    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        role: "",
        email: "",
        otp:"",
        password: "",
    });



    const fetchDoctors = async () => {
        try {
            const response = await API.get("/doctor/all");
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };


    // ====== fetch my profile ====== //
    const fetchMyProfile = async () => {
        try {
            const response = await API.get("/doctor/my-profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDoctorData({
                specialization: response.data.specialization,
                experienceYears: response.data.experienceYears,
                hospitalName: response.data.hospitalName
            });

        } catch (error) {
            console.log("Doctor profile not found");
        }
    };

    useEffect(() => {
        if (!token) return;

        fetchDoctors();

        if (role === "Doctor") {
            fetchMyProfile();
        }
    }, []);








    // ==== handle otp ===== //
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ====== handle send otp ====== //
    const handleSendOtp = async () => {
        try {
            // Call backend OTP endpoint (if exists)
            await API.post("/auth/send-otp", {
                email: formData.email,
            });

            setOtpSent(true);
            setMessage("OTP sent successfully");
        } catch (error) {
            setMessage("Failed to send OTP");
        }
    };


    // ================= REGISTER =================

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                otp: formData.otp
            });

            setMessage("Registration successful! Please login.");
            setIsRegister(false);

        } catch (err) {
            setMessage(err.response?.data || "Registration failed");
        }
    };


    // ================= LOGIN =================
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", formData.email);
            localStorage.setItem("role", response.data.role);

            setToken(response.data.token);
            setEmail(formData.email);
            setMessage("");
            navigate("/");



        } catch (err) {
            setMessage("Invalid credentials");
        }
    };

    // ===== register as doctor ===== //

    const handleAddDoctor = async (e) => {
        e.preventDefault();

        try {
            await API.post("/doctor/create", doctorData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Doctor profile created successfully!");
            setShowForm(false);
            fetchDoctors();

        } catch (error) {
            console.error(error);
            alert("Error creating doctor profile");
        }
    };

    // ====== update doctor ======== //
    const handleUpdateDoctor = async (e) => {
        e.preventDefault();

        try {
            await API.put("/doctor/update", doctorData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Profile Updated Successfully!");
            setShowForm(false);
            fetchDoctors();

        } catch (error) {
            console.error(error);
            alert("Error updating profile");
        }
    };




    // ================= LOGOUT =================
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setToken(null);
        setEmail(null);
    };

    // ================= AUTH PAGE =================

    if (!token) {
        return (
            <div style={mainAuthContainer}>

                {/* LEFT SIDE - FORM */}
                <div style={leftSection}>
                    <div style={authBox}>
                        <h2>{isRegister ? "Create Account" : "Welcome to MedVault"}</h2>

                        <form onSubmit={isRegister ? handleRegister : handleLogin}>

                            {isRegister && (
                                <>
                                    <input name="name" placeholder="Full Name" onChange={handleChange} required style={inputStyle} />
                                    <input name="age" type="number" placeholder="Age" onChange={handleChange} required style={inputStyle} />

                                    <select name="gender" onChange={handleChange} required style={inputStyle}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    <select name="role" onChange={handleChange} required style={inputStyle}>
                                        <option value="">Select Role</option>
                                        <option value="Patient">Patient</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Admin">Admin</option>
                                    </select>

                                    {!otpSent && (
                                        <button type="button" onClick={handleSendOtp} style={buttonStyle}>
                                            Send OTP
                                        </button>
                                    )}

                                    {otpSent && (
                                        <input name="otp" placeholder="Enter OTP" onChange={handleChange} required style={inputStyle} />
                                    )}
                                </>
                            )}

                            <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
                            <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />

                            <button type="submit" style={buttonStyle}>
                                {isRegister ? "Register" : "Login"}
                            </button>
                        </form>

                        {message && <p style={{ color: "red" }}>{message}</p>}

                        <p style={{ marginTop: "10px" }}>
                            {isRegister ? "Already have an account?" : "Don't have an account?"}
                            <span
                                style={{ color: "#2b6be6", cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => setIsRegister(!isRegister)}
                            >
                            {isRegister ? "Login" : "Register"}
                        </span>
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - INFO */}
                <div style={rightSection}>
                    <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
                        MedVault Application
                    </h1>

                    <ul style={{ textAlign: "left", lineHeight: "1.8" }}>
                        <li>🔐 Secure Medical Record Storage</li>
                        <li>👨‍⚕️ Smart Doctor Appointment Booking</li>
                        <li>📁 Digital Health History Access</li>
                        <li>📊 Real-Time Health Monitoring</li>
                        <li>☁️ Cloud-Based Data Backup</li>
                        <li>🛡️ OTP-Based Secure Authentication</li>
                    </ul>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
                        alt="medical"
                        style={{ width: "180px", marginTop: "30px" }}
                    />
                </div>

            </div>
        );
    }


    // ================= DASHBOARD ================= //
    return (
        <div style={{ fontFamily: "Arial", background: "#f4f6f9", minHeight: "100vh" }}>
            <nav style={navStyle}>
                <h2>MedVault</h2>
                <div>
                    <span>{email}</span>
                    <button onClick={logout} style={logoutStyle}>Logout</button>
                </div>
            </nav>

            <div style={{ padding: "30px" }}>
                <h1>Digital Healthcare Dashboard</h1>

                {activePage === "" && (
                    <div style={cardContainer}>

                        {/* Doctor Profiles */}
                        <div style={card} onClick={() => {
                            setActivePage("doctors");
                            navigate("/doctors");
                        }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                                alt="doctor"
                                style={imgStyle}
                            />
                            <h3>Doctor Profiles</h3>
                            <p>Browse experienced and trusted medical specialists.</p>
                        </div>


                        {/* Appointment Booking */}
                        <div style={card} onClick={() => {
                            setActivePage("appointments");
                            navigate("/appointments");
                        }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                                alt="appointment"
                                style={imgStyle}
                            />
                            <h3>Appointment Booking</h3>
                            <p>Schedule appointments quickly and efficiently.</p>
                        </div>


                        {/* Doctor Prescriptions */}
                        <div style={card} onClick={() => {
                            setActivePage("prescriptions");
                            navigate("/prescriptions");
                        }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
                                alt="prescription"
                                style={imgStyle}
                            />
                            <h3>Doctor Prescriptions</h3>
                            <p>View prescribed medicines and dosage details.</p>
                        </div>


                        {/* Patient Profile */}
                        <div style={card} onClick={() => {
                            setActivePage("patients");
                            navigate("/patients");
                        }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                                alt="profile"
                                style={imgStyle}
                            />
                            <h3>Patient Profile</h3>
                            <p>Manage your personal health information easily.</p>
                        </div>


                        {/* Medical Records */}
                        <div style={card} onClick={() => {
                            setActivePage("medical-records");
                            navigate("/medical-records");   // ✅ FIXED
                        }}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
                                alt="records"
                                style={imgStyle}
                            />
                            <h3>Medical Records</h3>
                            <p>Securely store and access your health reports.</p>
                        </div>

                    </div>
                )}



                {/* ================= CONTENT AREA ================= */}
                    <div style={{ marginTop: "40px" }}>
                        <Routes>

                            <Route path="doctors" element={
                                <div style={{ ...card, width: "100%" }}>

                                    <BackToDashboard setActivePage={setActivePage} />

                                    <h2>Doctor Profiles</h2>

                                    {/* ✅ Show Add Profile Button ONLY for Doctor */}
                                    {role === "Doctor" && (
                                        <button
                                            onClick={() => setShowForm(!showForm)}
                                            style={buttonStyle}
                                        >
                                            {doctorData.specialization ? "Edit Profile" : "Create Profile"}
                                        </button>
                                    )}



                                    {/* ✅ FORM */}
                                    {showForm && (
                                        <form
                                            onSubmit={doctorData.specialization ? handleUpdateDoctor : handleAddDoctor}
                                            style={{ marginTop: "20px" }}
                                        >



                                        <input
                                                placeholder="Specialization"
                                                value={doctorData.specialization}
                                                onChange={(e) =>
                                                    setDoctorData({
                                                        ...doctorData,
                                                        specialization: e.target.value
                                                    })
                                                }
                                                required
                                                style={inputStyle}
                                            />

                                            <input
                                                placeholder="Experience (Years)"
                                                value={doctorData.experienceYears}
                                                onChange={(e) =>
                                                    setDoctorData({
                                                        ...doctorData,
                                                        experienceYears: e.target.value
                                                    })
                                                }
                                                required
                                                style={inputStyle}
                                            />

                                            <input
                                                placeholder="Hospital Name"
                                                value={doctorData.hospitalName}
                                                onChange={(e) =>
                                                    setDoctorData({
                                                        ...doctorData,
                                                        hospitalName: e.target.value
                                                    })
                                                }
                                                required
                                                style={inputStyle}
                                            />

                                            <button type="submit" style={buttonStyle}>
                                                Save Profile
                                            </button>
                                        </form>
                                    )}

                                    {/* ✅ Doctor List */}
                                    {doctors.length > 0 ? (
                                        doctors.map((doc) => (
                                            <div key={doc.id}>
                                                <h3>{doc.name}</h3>
                                                <p>Specialization: {doc.specialization}</p>
                                                <p>Experience: {doc.experienceYears}</p>
                                                <p>Hospital: {doc.hospitalName}</p>
                                                <hr />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No doctors available.</p>
                                    )}


                                </div>
                            } />



                            <Route
                                path="appointments"
                                element={
                                    <Appointments
                                        setActivePage={setActivePage}
                                        doctors={doctors}
                                    />
                                }
                            />



                            <Route path="patients" element={
                                <div style={{ ...card, width: "100%" }}>
                                    <BackToDashboard setActivePage={setActivePage} />

                                    <h2>Patient Profile</h2>
                                    <p>Email: {email}</p>
                                    <p>Role: {role}</p>
                                </div>
                            } />

                            <Route path="medical-records" element={
                                <div style={{ ...card, width: "100%" }}>
                                    <BackToDashboard setActivePage={setActivePage} />
                                    <h2>Medical Records</h2>
                                    <p>Medical records will appear here.</p>
                                </div>
                            } />

                            <Route path="prescriptions" element={
                                <div style={{ ...card, width: "100%" }}>
                                    <BackToDashboard setActivePage={setActivePage} />
                                    <h2>Doctor Prescriptions</h2>
                                    <p>Prescription details will appear here.</p>
                                </div>
                            } />

                        </Routes>
                    </div>



                </div>
            </div>

    );
}

// ================= STYLES =================


const authBox = {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
};

const mainAuthContainer = {
    display: "flex",
    height: "100vh",
};

const leftSection = {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f9",
};

const rightSection = {
    width: "50%",
    background: "linear-gradient(to bottom right, #2b6be6, #3a8ef6)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
};


const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    background: "#2b6be6",
    color: "white",
    border: "none",
    cursor: "pointer",
};

const navStyle = {
    background: "#1f3c88",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
};

const logoutStyle = {
    marginLeft: "20px",
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
};

const cardContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "30px",
    justifyContent: "flex-start",
};

const navButtonStyle = {
    marginRight: "10px",
    padding: "8px 12px",
    background: "#2b6be6",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
};



const card = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    cursor: "pointer",
};



const imgStyle = {
    width: "60px",
    marginBottom: "10px",
};

function Appointments({ setActivePage, doctors }) {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const [filter, setFilter] = useState("ALL");



    const [form, setForm] = useState({
        date: "",
        time: "",
        doctor: "",
        issue: ""
    });

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const fetchAppointments = async () => {
        try {

            const patientId = localStorage.getItem("userId");

            let response;

            if (role === "Doctor") {
                response = await API.get(`/appointments/doctor/${userId}`);
            } else {
                response = await API.get(`/appointments/patient/${userId}`);
            }

            setAppointments(response.data);


            setAppointments(response.data);

        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const patientId = localStorage.getItem("userId");  // Make sure you store this at login
            const doctorId = form.doctor;  // we will fix this below

            const dateTime = `${form.date}T${form.time}`;

            await API.post("/appointments/book", null, {
                params: {
                    patientId: patientId,
                    doctorId: doctorId,
                    dateTime: dateTime
                }
            });

            setMessage("Appointment Booked Successfully!");

            setForm({
                date: "",
                time: "",
                doctor: "",
                issue: ""
            });

        } catch (error) {
            setMessage("Error booking appointment");
        }
    };

    const handleCancel = async (appointmentId) => {
        try {

            const patientId = localStorage.getItem("userId");

            await API.put(
                `/appointments/${appointmentId}/cancel/${patientId}`
            );

            fetchAppointments(); // refresh list

        } catch (error) {
            alert("Error cancelling appointment");
        }
    };

    const handleStatus = async (appointmentId, action) => {
        try {

            if (action === "approve") {
                await API.put(`/appointments/${appointmentId}/approve/${userId}`);
            }

            if (action === "reject") {
                await API.put(`/appointments/${appointmentId}/reject/${userId}`);
            }

            if (action === "complete") {
                await API.put(`/appointments/${appointmentId}/complete/${userId}`);
            }

            fetchAppointments();

        } catch (error) {
            alert("Error updating status");
        }
    };

    const now = new Date();

    const upcomingAppointments = appointments.filter(
        (a) => new Date(a.appointmentDate) >= now
    );

    const pastAppointments = appointments.filter(
        (a) => new Date(a.appointmentDate) < now
    );
    let filteredAppointments;

    if (filter === "UPCOMING") {
        filteredAppointments = upcomingAppointments;
    } else if (filter === "PAST") {
        filteredAppointments = pastAppointments;
    } else {
        filteredAppointments = appointments;
    }




    return (
        <div style={{padding: "20px"}}>
            <h2>Book Appointment</h2>
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => setFilter("ALL")}
                    style={navButtonStyle}
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("UPCOMING")}
                    style={navButtonStyle}
                >
                    Upcoming
                </button>

                <button
                    onClick={() => setFilter("PAST")}
                    style={navButtonStyle}
                >
                    Past
                </button>
            </div>


            <BackToDashboard setActivePage={setActivePage}/>


            <form onSubmit={handleSubmit}>

                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    style={inputStyle}
                />

                <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc, index) => (
                        <option key={index} value={doc.name}>
                            {doc.name} - {doc.specialization}
                        </option>
                    ))}
                </select>


                <input
                    name="issue"
                    placeholder="Issue"
                    value={form.issue}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                    Book Appointment
                </button>
            </form>

            {message && (
                <p style={{color: "green", marginTop: "15px"}}>
                    {message}
                </p>
            )}

            {filteredAppointments.length > 0 && (
                <table
                    border="1"
                    width="100%"
                    style={{marginTop: "20px", textAlign: "center"}}
                >
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Status</th>
                        <th>Issue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredAppointments.map((a) => (
                        <tr key={a.id}>
                            <td>{a.appointmentDate?.split("T")[0]}</td>
                            <td>{a.appointmentDate?.split("T")[1]?.substring(0, 5)}</td>
                            <td>{a.doctor?.name}</td>

                            {/* Status Badge */}
                            <td>
        <span
            style={{
                padding: "5px 10px",
                borderRadius: "15px",
                color: "white",
                fontSize: "12px",
                background:
                    a.status === "APPROVED" ? "green" :
                        a.status === "REJECTED" ? "red" :
                            a.status === "PENDING" ? "orange" :
                                a.status === "COMPLETED" ? "blue" :
                                    "gray"
            }}
        >
            {a.status}
        </span>
                            </td>

                            {/* Action Column */}
                            <td>

                                {/* Patient Cancel */}
                                {role !== "Doctor" &&
                                    a.status !== "COMPLETED" &&
                                    a.status !== "CANCELLED" && (
                                        <button
                                            onClick={() => handleCancel(a.id)}
                                            style={{
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "5px 10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                {/* Doctor Approve / Reject */}
                                {role === "Doctor" && a.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => handleStatus(a.id, "approve")}
                                            style={{
                                                marginRight: "5px",
                                                background: "green",
                                                color: "white",
                                                border: "none",
                                                padding: "5px"
                                            }}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => handleStatus(a.id, "reject")}
                                            style={{
                                                background: "red",
                                                color: "white",
                                                border: "none",
                                                padding: "5px"
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {/* Doctor Complete */}
                                {role === "Doctor" && a.status === "APPROVED" && (
                                    <button
                                        onClick={() => handleStatus(a.id, "complete")}
                                        style={{
                                            background: "blue",
                                            color: "white",
                                            border: "none",
                                            padding: "5px"
                                        }}
                                    >
                                        Complete
                                    </button>
                                )}

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <h3 style={{ marginTop: "40px" }}>Past Appointments</h3>

            {pastAppointments.length > 0 && (
                <table
                    border="1"
                    width="100%"
                    style={{ marginTop: "20px", textAlign: "center" }}
                >
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pastAppointments.map((a) => (
                        <tr key={a.id}>
                            <td>{a.appointmentDate?.split("T")[0]}</td>
                            <td>{a.appointmentDate?.split("T")[1]?.substring(0,5)}</td>
                            <td>{a.doctor?.name}</td>
                            <td>{a.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}


function BackToDashboard({ setActivePage }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => {
                setActivePage("");
                navigate("/");
            }}
            style={{
                marginBottom: "20px",
                padding: "8px 12px",
                background: "#2b6be6",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px"
            }}
        >
            ← Go to Dashboard
        </button>
    );
}



export default App;
