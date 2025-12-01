/*
    This is our http api for all things auth, which we use to 
    send authorization requests to our back-end API. Note we`re 
    using the Axios library for doing this, which is an easy to 
    use AJAX-based library. We could (and maybe should) use Fetch, 
    which is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

var baseURL = 'http://localhost:4000/auth'

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getLoggedIn = async () => {
    let response = await fetch(baseURL + "/loggedIn/", {
        method: "GET",
        credentials: "include"
    })
    let data = await response.json()
    return { status: response.status, data }
}
export const loginUser = async (email, password) => {
    let response = await fetch(baseURL + "/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            email : email,
            password : password
        }),
        credentials: "include"
    })
    let data = await response.json()
    return { status: response.status, data }
}
export const logoutUser = async () => {
    let response = await fetch(baseURL + "/logout/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    })
    let data = await response.json();
    
    return { status: response.status, data }
}

export const registerUser = async (firstName, lastName, email, password, passwordVerify) => {
    let response = await fetch(baseURL + "/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            passwordVerify : passwordVerify
        }),
        credentials: "include"
    })
    let data = await response.json()
    return { status: response.status, data }
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
