import { useEffect } from "react";
import LayoutHeader from "./header";
import { useLocation } from "react-router-dom";
import { findMenuByPath } from "../utils/menuManagement";
import { useAuth } from "../auth/authContext";


const AppLayout: React.ComponentType<{
    children: React.ReactNode,
    loading: boolean,
    loadingOn: () => void,
    loadingOff: () => void
}> = ({ children }) => {
    const { navDetails, setCurrentPage } = useAuth();

    const location = useLocation();

        useEffect(() => {
        if (Array.isArray(navDetails) && navDetails.length > 0) {
            const currentMenuData = findMenuByPath(navDetails, location.pathname);
            console.log({ currentMenuData, location })
            setCurrentPage(currentMenuData);
        }
    }, [location.pathname, navDetails])

    return (
        <>
            <LayoutHeader />
            <div 
                style={{ 
                    padding: "1.5rem", 
                    minHeight: '91vh',
                    // background: "linear-gradient(180deg,#f7f5f8,#f2fbff)"
                }}>{children}</div>            
        </>
    )
}

export default AppLayout;