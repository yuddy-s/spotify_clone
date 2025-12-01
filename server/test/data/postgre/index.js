const db = require('../../../db/postgresql'); 
const testData = require('../example-db-data.json');

async function resetDB() {
    console.log("Resetting PostgreSQL database...");

    try {
        await db.connect()
        await db.models.User.sync();
        
        await db.models.Playlist.sync();

        await db.clearCollection("User");
        await db.clearCollection("Playlist");

        const createdPlaylists = await db.fillCollection("Playlist", testData.playlists);

        const playlistIdMap = {};
        createdPlaylists.forEach(p => {
            const original = testData.playlists.find(tp => tp.name === p.name);
            if (original) {
                playlistIdMap[original._id] = p.id;
            }
        });

        const usersWithPlaylists = testData.users.map(user => {
            const userPlaylists = user.playlists.map(plId => playlistIdMap[plId]).filter(Boolean);
            return { ...user, playlists: userPlaylists };
        });

        await db.fillCollection("User", usersWithPlaylists);

        console.log("PostgreSQL database reset complete!");
    } catch (err) {
        console.error("Error resetting database:", err);
    }
}

resetDB();
module.exports = resetDB; 
