import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/authContext";
import { RequireAuth } from "./auth/requireAuth";
import Login from "./auth/login";
import AppLayout from './layout/layout';
import { Suspense, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { appRoutes } from './routes/indexRouter';
import MainMenuList from './layout/mainMenu';
import { LoadingScreen } from './components/loadingScreen';
import type { MenuRow } from './modules/configuration/types';
import { getAppMenuData } from './modules/configuration/api';


function App() {
    const { token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const [menuData, setMenuData] = useState([]);

    async function fetchMenuData(): Promise<MenuRow[] | any> {
        try {
            const res = await getAppMenuData(loadingOn, loadingOff);
            setMenuData(res);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchMenuData();
    }, []);

    const loadingOn = () => setLoading(true)
    const loadingOff = () => setLoading(false);

    return (
        <>

            <LoadingScreen
                loading={loading}
                tone="light"
                logo={<span style={{ fontWeight: 700 }}>ERP</span>}
            />

            <BrowserRouter>

                {!token && (
                    <Routes>
                        <Route 
                            path="*" 
                            element={
                                <Login 
                                    loading={loading} 
                                    loadingOn={loadingOn} 
                                    loadingOff={loadingOff} 
                                />
                            } 
                        />
                    </Routes>
                )}

                <RequireAuth>
                    <AppLayout loading={loading} loadingOn={loadingOn} loadingOff={loadingOff}>
                        <Suspense fallback={<div className="overlay"><CircularProgress className="spinner" /></div>}>
                            <Routes>

                                <Route
                                    path="/"
                                    element={
                                        <MainMenuList
                                            menuData={menuData}
                                            loading={loading}
                                            loadingOn={loadingOn} 
                                            loadingOff={loadingOff}
                                        />
                                    }
                                />

                                {appRoutes.map(({ path, component: Component }) => (
                                    <Route 
                                        key={path} 
                                        path={path} 
                                        element={
                                            <Component 
                                                loading={loading}
                                                loadingOn={loadingOn} 
                                                loadingOff={loadingOff} 
                                            />
                                        } 
                                    />
                                ))}

                            </Routes>
                        </Suspense>
                    </AppLayout>
                </RequireAuth>

            </BrowserRouter>
        </>
    )
}

export default App
