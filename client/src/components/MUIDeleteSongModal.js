
export default function MUIDeleteSongModal({ song, onClose, onConfirm }) {
    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxWidth: "500px",
            backgroundColor: "#B0FFB5",
            border: "4px solid #0E8503",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>

            <div style={{
                backgroundColor: "#0E8503",
                color: "white",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px"
            }}>
                <h2 style={{ margin: 0 }}>Delete Song</h2>
            </div>

            <div style={{
                padding: "30px 20px",
                textAlign: "center",
                fontSize: "16px",
                color: "#000"
            }}>
                <p>Are you sure you want to delete the <b>{song.title}</b> song?</p>
                <p style={{ fontSize: "14px", marginTop: "10px" }}>Doing so means it will be permanently removed!</p>
            </div>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "20px"
            }}>
                <button
                    onClick={onConfirm} 
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "12px 25px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "0.25s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#555"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "black"}
                >
                    Confirm
                </button>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "12px 25px",
                        borderRadius: "12px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "0.25s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#555"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "black"}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
