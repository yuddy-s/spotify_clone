import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../store';
import PlaylistCard from './PlaylistCard';
import MUIDeleteModal from './MUIDeleteModal';

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [playlistName, setPlaylistName] = useState('');
    const [userName, setUserName] = useState('');
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songYear, setSongYear] = useState('');

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

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
           
            <div style={{ width: '35%', height: '65vh', padding: '50px' }}>
                <h2 style={{ marginBottom: "35px" }}>Playlists</h2>
                <input 
                    type="text" 
                    placeholder="Playlist Name" 
                    value={playlistName} 
                    onChange={e => setPlaylistName(e.target.value)} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="text" 
                    placeholder="User Name" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="text" 
                    placeholder="Song Title" 
                    value={songTitle} 
                    onChange={e => setSongTitle(e.target.value)} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="text" 
                    placeholder="Song Artist" 
                    value={songArtist} 
                    onChange={e => setSongArtist(e.target.value)} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input 
                    type="number" 
                    placeholder="Song Year" 
                    value={songYear} 
                    onChange={e => setSongYear(e.target.value)} 
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <div style={{ marginTop: '20px' }}>
                    <button onClick={handleSearch} style={{ padding: '10px 20px', marginRight: '10px' }}>Search</button>
                    
                    <button 
                        onClick={handleClear}  
                        style={{  
                            position: "relative",
                            left: "25vw",         
                            padding: "10px 14px",
                            backgroundColor: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            transition: "ease 0.25s"
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#6f0707ff")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
                    >  
                        Clear
                    </button>
                </div>
            </div>

            <div style={{
                width: '2px',
                backgroundColor: '#ccc',
                height: '70%',
                position: "absolute",
                left: '50%',
                top: 140
            }} />

            <div style={{ width: '65%', padding: '20px', overflowY: 'auto' }}>
                {store.idNamePairs.map(pair => (
                    <PlaylistCard key={pair._id} idNamePair={pair} selected={false} />
                ))}
                <MUIDeleteModal />
            </div>
        </div>
    );
};

export default HomeScreen;
