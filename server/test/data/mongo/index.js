const db = require('../../../db/mongodb');
const testData = require('../example-db-data.json');

async function resetDB() {
    await db.connect();
    console.log("Resetting MongoDB database...");

    await db.clearCollection('Playlist');
    await db.clearCollection('User');

    const playlists = await db.fillCollection('Playlist', testData.playlists);

    const usersWithPlaylists = testData.users.map(user => {
        const userPlaylists = playlists
            .filter(p => p.ownerEmail === user.email)
            .map(p => p._id.toString()); 
        return {
            ...user,
            playlists: userPlaylists
        };
    });

    await db.fillCollection('User', usersWithPlaylists);

    console.log("Database reset complete!")
}

resetDB().catch(console.error);
module.exports = resetDB;