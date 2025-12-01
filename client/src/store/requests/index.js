/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

var baseURL = 'http://localhost:4000/store' 

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createPlaylist = async (newListName, newSongs, userEmail) => {
    let response = await fetch(baseURL + "/playlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            name: newListName,
            songs: newSongs,
            ownerEmail: userEmail
        }),
        credentials: "include"
    })
    let data = await response.json()
    return { status: response.status, data }
}

export const deletePlaylistById = async (id) => {
    let response = await fetch(baseURL + `/playlist/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json"},
            credentials: "include"
        }
    )
    let data = await response.json()
    return { status: response.status, data }
}

export const getPlaylistById = async (id) => {
    let response = await fetch(baseURL + `/playlist/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    })
    let data = await response.json()
    return { status: response.status, data }
}
export const getPlaylistPairs = async () => {
    let response = await fetch(baseURL + `/playlistpairs/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        }
    )
    let data = await response.json()
    return { status: response.status, data }
}
export const updatePlaylistById = async (id, playlist) => {
    const response = await fetch(
        baseURL + `/playlist/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ playlist: playlist }),
            credentials: "include"
        }
    )
    let data = await response.json()
    return { status: response.status, data }
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById
}

export default apis
