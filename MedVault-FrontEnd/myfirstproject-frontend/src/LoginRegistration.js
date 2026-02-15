import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setMessage("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await API.post("/api/auth/login", {
                email: formData.email.trim(),
                password: formData.password
            });

            // Save token
            localStorage.setItem("token", response.data.token);

            setMessage("Login successful!");

            // Redirect after 1 second
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {

            console.log("Login error:", error.response);

            let errorMessage = "Login failed";

            if (error.response) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data;
                } else if (error.response.data?.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            }

            setMessage(String(errorMessage));

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2>Login to MedVault</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                />

                <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {message && (
                    <p style={styles.message}>
                        {typeof message === "object"
                            ? JSON.stringify(message)
                            : message}
                    </p>
                )}

                <p style={styles.registerLink}>
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/")}
                        style={styles.link}
                    >
                        Register here
                    </span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f1f5f9"
    },
    form: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "350px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc"
    },
    button: {
        padding: "10px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    message: {
        textAlign: "center",
        fontSize: "14px",
        color: "red"
    },
    registerLink: {
        textAlign: "center",
        fontSize: "13px"
    },
    link: {
        color: "#2563eb",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default Login;
