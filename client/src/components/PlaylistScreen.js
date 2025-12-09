import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import PlaylistCard from './PlaylistCard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';

const PlaylistScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [playlistName, setPlaylistName] = useState('');
    const [userName, setUserName] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songYear, setSongYear] = useState('');
    const [sortOption, setSortOption] = useState('listenersDesc');

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleSearch = () => {
        store.loadIdNamePairs({
            playlistName,
            userName,
            songTitle,
            songArtist,
            songYear
        });
    };

    const handleClear = () => {
        setPlaylistName('');
        setUserName('');
        setSongTitle('');
        setSongArtist('');
        setSongYear('');
        store.loadIdNamePairs();
    };

    const handleNewPlaylist = async () => {
        await store.createNewList();
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', paddingTop: '50px' }}>
            {/* Left column: Search */}
            <div style={{ width: '35%', height: '65vh', padding: '0 50px' }}>
                <h2 style={{ marginBottom: "35px", fontWeight: 'bold', color: '#C20CB9', fontFamily: 'Title Page/Font Family' }}>
                    Playlists
                </h2>
                {[
                    { placeholder: "Playlist Name", value: playlistName, setter: setPlaylistName },
                    { placeholder: "User Name", value: userName, setter: setUserName },
                    { placeholder: "Song Title", value: songTitle, setter: setSongTitle },
                    { placeholder: "Song Artist", value: songArtist, setter: setSongArtist },
                    { placeholder: "Song Year", value: songYear, setter: setSongYear, type: 'number' },
                ].map((input, idx) => (
                    <input
                        key={idx}
                        type={input.type || "text"}
                        placeholder={input.placeholder}
                        value={input.value}
                        onChange={e => input.setter(e.target.value)}
                        style={{
                            width: '100%',
                            marginBottom: '12px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#D3D3D3',
                        }}
                    />
                ))}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6750A4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <SearchIcon /> Search
                    </button>
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#6750A4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Gray divider */}
            <div style={{ width: '2px', backgroundColor: '#ccc', height: '70%', position: "absolute", left: '50%', top: 140 }} />

            {/* Right column: Sort + Playlist Cards + New Playlist */}
            <div style={{ width: '40%', padding: '20px', marginLeft: '8vw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                {/* Sort options */}
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="sort">Sort by:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        <option value="listenersDesc">Listeners (Hi → Lo)</option>
                        <option value="listenersAsc">Listeners (Lo → Hi)</option>
                        <option value="nameAsc">Playlist Name (A → Z)</option>
                        <option value="nameDesc">Playlist Name (Z → A)</option>
                        <option value="ownerAsc">User Name (A → Z)</option>
                        <option value="ownerDesc">User Name (Z → A)</option>
                    </select>
                </div>

                <div     
                    style={{
                        height: '47vh',
                        overflowY: 'auto',
                        paddingRight: '10px'
                    }}
                >
                    {store.idNamePairs.map(pair => (
                        <PlaylistCard key={pair._id} idNamePair={pair} style={{ height: '70px', marginBottom: '8px' }} />
                    ))}
                </div>

                {/* New Playlist Button */}
                <button
                    onClick={handleNewPlaylist}
                    style={{
                        position: "absolute",
                        bottom: "8vh",
                        padding: '10px 14px',
                        backgroundColor: '#6750A4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'ease 0.25s'
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#403266ff")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#6750A4")}
                >
                    <AddBoxIcon fontSize='small' /> &nbsp; New Playlist
                </button>
            </div>
        </div>
    );
};

export default PlaylistScreen;
