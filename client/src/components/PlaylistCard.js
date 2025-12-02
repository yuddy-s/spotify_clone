import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function PlaylistCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        //let _id = event.target.id;
        //_id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', /*p: 1*/ }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '13pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box> 
            <button 
                style={{ 
                    backgroundColor: "#D2292F", 
                    color: "white", 
                    padding: '10px 10px', 
                    borderRadius: "10px", 
                    marginLeft: "20px",
                    border: '1px solid black',
                    transition: "ease 0.25s" 
                }}
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }}
                onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = "#D2292F"; e.target.style.color = "#fff"}}
            >
                Delete
            </button>
            
            <button 
                style={{ 
                    backgroundColor: "#3A64C4", 
                    color: "white", 
                    padding: '10px 10px', 
                    borderRadius: "10px", 
                    marginLeft: "10px",
                    border: '1px solid black',
                    transition: "ease 0.25s" 
                }}
                onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = "#3A64C4"; e.target.style.color = "#fff"}}
                onClick={handleToggleEdit}
            >
                Edit
            </button>

            <button 
                style={{ 
                    backgroundColor: "#077836", 
                    color: "white", 
                    padding: '10px 10px', 
                    borderRadius: "10px", 
                    marginLeft: "10px",
                    border: '1px solid black',
                    transition: "ease 0.25s" 
                }}
                onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = "#077836"; e.target.style.color = "#fff"}}
            >
                Copy
            </button>
    
            <button 
                style={{ 
                    backgroundColor: "#DE24BC", 
                    color: "white", 
                    padding: '10px 10px', 
                    borderRadius: "10px", 
                    marginLeft: "10px",
                    border: '1px solid black',
                    transition: "ease 0.25s" 
                }}
                onMouseEnter={(e) => {e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000000"}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = "#DE24BC"; e.target.style.color = "#fff"}}
            >
                Play
            </button>

        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default PlaylistCard;