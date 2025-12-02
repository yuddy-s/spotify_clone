import { useState, useContext, useRef } from "react";
import AuthContext from "../auth";
import LockIcon from "@mui/icons-material/Lock";

const defaultPfp = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);

    const [avatar, setAvatar] = useState(auth.user?.avatar || defaultPfp);
    const [username, setUsername] = useState(auth.user?.username || "");
    const [email, setEmail] = useState(auth.user?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const fileInputRef = useRef(null);

    function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    }

    function handleSave() {
        console.log("Saving changes:", { username, email, password, confirmPassword, avatar });
    }

    return (
        <div style={{
            width: "600px",
            margin: "60px auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            position: "relative",
        }}>

            <LockIcon
                style={{
                    fontSize: "40px",
                    color: "#000",
                    position: "absolute",
                    top: "-50px",
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
            />

            <h1 style={{ margin: 0, fontSize: "28px", textAlign: "center" }}>
                Edit Account
            </h1>

            <div style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "40px"
            }}>

                {/*  account avatar */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0
                }}>
                    <div style={{
                        width: "95px",
                        height: "95px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #ccc",
                    }}>
                        <img
                            src={avatar}
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />
                    </div>
                    <button
                        style={{
                            backgroundColor: "#e6e6e6",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#d4d4d4"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#e6e6e6"}
                        onClick={() => fileInputRef.current.click()}
                    >
                        Change Profile Picture
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    flexGrow: 1
                }}>
                    <input
                        style={inputStyle}
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        style={inputStyle}
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
                        <button
                            style={{
                                backgroundColor: "#000",
                                padding: "10px 16px",
                                color: "white",
                                borderRadius: "8px",
                                border: "1px solid black",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "0.25s"
                            }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000" }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = "#000"; e.target.style.color = "#fff" }}
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>

                        <button
                            style={{
                                backgroundColor: "#000",
                                padding: "10px 16px",
                                color: "white",
                                borderRadius: "8px",
                                border: "1px solid black",
                                cursor: "pointer",
                                fontWeight: "bold",
                                transition: "0.25s"
                            }}
                            onMouseEnter={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000" }}
                            onMouseLeave={(e) => { e.target.style.backgroundColor = "#000"; e.target.style.color = "#fff" }}
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    width: "280px"
};
