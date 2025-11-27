import './App.css';
import './css/input.css';
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
import PageNotFound from './components/404page';
import { buildMenuTree } from './utils/menuManagement';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
    const { token, setNavDetails } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [menuData, setMenuData] = useState<MenuRow[]>([]);
    const localToken = localStorage.getItem('token')

    async function fetchMenuData(): Promise<MenuRow[] | any> {
        try {
            const res = await getAppMenuData(loadingOn, loadingOff);
            console.log(res)
            setMenuData(res);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (localToken) fetchMenuData();
    }, [localToken]);

    useEffect(() => {
        const menuTree = buildMenuTree(menuData.filter(m => Boolean(m.isActive) && Boolean(m.isVisible)));
        setNavDetails(menuTree);
    }, [menuData]);

    const loadingOn = () => setLoading(true)
    const loadingOff = () => setLoading(false);

    // console.log({ navDetails })

    return (
        <>
            <ToastContainer />
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

                                <Route
                                    path="*"
                                    element={<PageNotFound />}
                                />

                            </Routes>
                        </Suspense>
                    </AppLayout>
                </RequireAuth>

            </BrowserRouter>
        </>
    )
}

export default App
