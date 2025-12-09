import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import SongCard from './SongCard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';

const SongCatalogScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songYear, setSongYear] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [sortOption, setSortOption] = useState('titleAsc');

    // Load own songs on first render
    useEffect(() => {
        store.loadSongs({});
    }, []);

    const parseSortOption = (option) => {
        switch (option) {
            case "titleAsc": return { sortBy: "title", order: "asc" };
            case "titleDesc": return { sortBy: "title", order: "desc" };

            case "artistAsc": return { sortBy: "artist", order: "asc" };
            case "artistDesc": return { sortBy: "artist", order: "desc" };

            case "yearAsc": return { sortBy: "year", order: "asc" };
            case "yearDesc": return { sortBy: "year", order: "desc" };

            case "listensAsc": return { sortBy: "listens", order: "asc" };
            case "listensDesc": return { sortBy: "listens", order: "desc" };

            case "playlistsAsc": return { sortBy: "playlists", order: "asc" };
            case "playlistsDesc": return { sortBy: "playlists", order: "desc" };

            default: return {};
        }
    };

    const handleSearch = () => {
        const sortParams = parseSortOption(sortOption);
        store.loadSongs({
            title: songTitle.trim(),
            artist: songArtist.trim(),
            year: songYear.trim(),
            ...sortParams
        });
    };

    const handleClear = () => {
        setSongTitle('');
        setSongArtist('');
        setSongYear('');
        setSortOption("titleAsc");
        store.loadSongs(); // no params so only my songs
    };

    const handleNewSong = async () => {
        const newSong = await store.createSong();
        if (newSong) {
            setSelectedVideoId(newSong.youTubeId);
            setSelectedIndex(store.songs.findIndex(s => s._id === newSong._id));
        }
        store.loadSongs();
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>

            {/* LEFT SIDE */}
            <div style={{ 
                width: '35%', 
                height: '10vh', 
                padding: '30px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h2 style={{ marginBottom: "20px", color: '#C20CB9' }}>Song Catalog</h2>

                {/* Inputs */}
                <input 
                    type="text"
                    placeholder="Song Title"
                    value={songTitle}
                    onChange={e => setSongTitle(e.target.value)}
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#D3D3D3'
                    }}
                />
                <input 
                    type="text"
                    placeholder="Artist"
                    value={songArtist}
                    onChange={e => setSongArtist(e.target.value)}
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#D3D3D3'
                    }}
                />
                <input 
                    type="number"
                    placeholder="Year"
                    value={songYear}
                    onChange={e => setSongYear(e.target.value)}
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#D3D3D3'
                    }}
                />

                {/* Buttons */}
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
                            gap: '5px',
                            transition: 'ease 0.25s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#403266ff"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#6750A4"}
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
                            transition: 'ease 0.25s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#403266ff"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#6750A4"}
                    >
                        Clear
                    </button>
                </div>

                {/* YouTube preview */}
                <div style={{ width: "100%", marginTop: "10px" }}>
                    {selectedVideoId ? (
                        <iframe
                            width="100%"
                            height="230px"
                            src={`https://www.youtube.com/embed/${selectedVideoId}`}
                            title="YouTube Player"
                            frameBorder="0"
                            style={{ borderRadius: "8px" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div style={{
                            width: "100%",
                            height: "230px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#555"
                        }}>
                            Select a song to preview
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div style={{
                width: '2px',
                backgroundColor: '#ccc',
                height: '55%',
                position: "absolute",
                left: '50%',
                top: 180
            }} />

            {/* RIGHT SIDE SONG LIST */}
            <div style={{ 
                height: '50vh', 
                width: '40%', 
                padding: '20px', 
                marginLeft: '8vw', 
                marginTop: '3vh',
                marginBottom: '2vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "space-between"
            }}>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="sort">Sort by:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => {
                            setSortOption(e.target.value);
                            const sorting = parseSortOption(e.target.value);
                            store.loadSongs({
                                title: songTitle.trim(),
                                artist: songArtist.trim(),
                                year: songYear.trim(),
                                ...sorting
                            });
                        }}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        <option value="titleAsc">Title (A → Z)</option>
                        <option value="titleDesc">Title (Z → A)</option>
                        <option value="artistAsc">Artist (A → Z)</option>
                        <option value="artistDesc">Artist (Z → A)</option>
                        <option value="yearDesc">Year (Hi → Lo)</option>
                        <option value="yearAsc">Year (Lo → Hi)</option>
                        <option value="listensDesc">Listens (Hi → Lo)</option>
                        <option value="listensAsc">Listens (Lo → Hi)</option>
                        <option value="playlistsDesc">Playlists (Hi → Lo)</option>
                        <option value="playlistsAsc">Playlists (Lo → Hi)</option>
                    </select>
                </div>

                <div style={{ height: '100%', overflowY: 'auto', width: "35vw" }}>
                    {store.songs?.map((song, index) => (
                        <div
                            key={song._id || index}
                            onClick={() => {
                                setSelectedVideoId(song.youTubeId);
                                setSelectedIndex(index);
                            }}
                            style={{ 
                                cursor: "pointer",
                                backgroundColor: selectedIndex === index ? "#f4d44d" : "transparent",
                                borderRadius: "6px",
                                padding: "4px",
                                transition: "0.15s"
                            }}
                        >
                            <SongCard song={song} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {/* New Song button */}
            <button
                onClick={handleNewSong}
                style={{
                    position: "absolute",
                    bottom: "8vh",
                    right: "30vw",
                    padding: '10px 14px',
                    backgroundColor: '#6750A4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'ease 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#403266ff"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#6750A4"}
            >
                <AddBoxIcon fontSize='small' /> &nbsp; New Song
            </button>
        </div>
    );
};

export default SongCatalogScreen;
