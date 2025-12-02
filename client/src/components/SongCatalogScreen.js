import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import SongCard from './SongCard';
import MUIDeleteModal from './MUIDeleteModal';

const SongCatalogScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songYear, setSongYear] = useState('');

    const [selectedVideoId, setSelectedVideoId] = useState(null);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    const handleSearch = () => {
        store.loadIdNamePairs({
            songTitle,
            songArtist,
            songYear
        });
    };

    const handleClear = () => {
        setSongTitle('');
        setSongArtist('');
        setSongYear('');
        store.loadIdNamePairs();
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>

            <div style={{ 
                width: '35%', 
                height: '10vh', 
                padding: '30px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h2 style={{ marginBottom: "20px" }}>Song Catalog</h2>

                <input 
                    type="text"
                    placeholder="Song Title"
                    value={songTitle}
                    onChange={e => setSongTitle(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />

                <input 
                    type="text"
                    placeholder="Artist"
                    value={songArtist}
                    onChange={e => setSongArtist(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />

                <input 
                    type="number"
                    placeholder="Year"
                    value={songYear}
                    onChange={e => setSongYear(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />

                <div style={{ marginTop: '20px' }}>
                    <button 
                        onClick={handleSearch} 
                        style={{ padding: '10px 20px', marginRight: '10px' }}
                    >
                        Search
                    </button>
                    
                    <button 
                        onClick={handleClear}  
                        style={{  
                            padding: "10px 14px",
                            backgroundColor: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            transition: "ease 0.25s",
                            cursor: "pointer"
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#6f0707")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
                    >  
                        Clear
                    </button>
                </div>

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

            <div style={{
                width: '2px',
                backgroundColor: '#ccc',
                height: '55%',
                position: "absolute",
                left: '50%',
                top: 180
            }} />

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
                
                <div style={{ height: '100%', overflowY: 'auto', width: "35vw" }}>
                        {/* hard coded for testing */}
                        <div onClick={() => setSelectedVideoId("dQw4w9WgXcQ")} style={{ cursor: "pointer" }}>
                            <SongCard 
                                song={{ 
                                    title: "Never Gonna Give You Up", 
                                    artist: "Rick Astley",
                                    year: "1987",
                                    youTubeId: "dQw4w9WgXcQ"
                                }}
                                index={0}
                            />
                        </div>

                        <div onClick={() => setSelectedVideoId("ktvTqknDobU")} style={{ cursor: "pointer" }}>
                            <SongCard 
                                song={{ 
                                    title: "Radioactive", 
                                    artist: "Imagine Dragons",
                                    year: "2012",
                                    youTubeId: "ktvTqknDobU"
                                }}
                                index={1}
                            />
                        </div>

                        <div onClick={() => setSelectedVideoId("hTWKbfoikeg")} style={{ cursor: "pointer" }}>
                            <SongCard 
                                song={{ 
                                    title: "Smells Like Teen Spirit", 
                                    artist: "Nirvana",
                                    year: "1991",
                                    youTubeId: "hTWKbfoikeg"
                                }}
                                index={2}
                            />
                        </div>

                    {store.currentList?.songs?.map((song, index) => (
                        <div 
                            key={index}
                            onClick={() => setSelectedVideoId(song.youTubeId)}
                            style={{ cursor: "pointer" }}
                        >
                            <SongCard song={song} index={index} />
                        </div>
                    ))}
                </div>

                <MUIDeleteModal />
            </div>
        </div>
    );
};

export default SongCatalogScreen;
