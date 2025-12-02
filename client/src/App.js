import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    PlaylistScreen,
    SongCatalogScreen,
    EditAccountScreen,
    LoginScreen,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen
} from './components'
import WelcomeScreen from './components/WelcomeScreen.jsx';
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {   
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <Switch>
                        {/* <Route path="/" exact component={WelcomeScreen}/> */}
                        <Route path="/" exact component={WelcomeScreen} />
                        <Route path="/playlists/" exact component={PlaylistScreen} />
                        <Route path="/songs/" exact component={SongCatalogScreen} />
                        <Route path="/editAccount/" exact component={EditAccountScreen} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App