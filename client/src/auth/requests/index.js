
var baseURL = 'http://localhost:4000/api/auth'


export const getLoggedIn = async () => {
    const response = await fetch(baseURL + "/loggedIn", {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const loginUser = async (email, password) => {
    const response = await fetch(baseURL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const logoutUser = async () => {
    const response = await fetch(baseURL + "/logout", {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const registerUser = async (userName, email, password, passwordVerify, avatar) => {
    const response = await fetch(baseURL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password, passwordVerify, avatar }),
        credentials: "include"
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const editAccount = async (userName, email, password, passwordVerify, avatar) => {
    const response = await fetch(baseURL + "/editAccount", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
            userName, 
            email, 
            password, 
            passwordVerify, 
            avatar
         })
    });

    const data = await response.json();
    return { status: response.status, data };
}

const apis = { getLoggedIn, registerUser, loginUser, logoutUser, editAccount };
export default apis;
