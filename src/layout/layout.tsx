import { useEffect, useState } from "react";
import LayoutHeader from "./header";

const AppLayout: React.ComponentType<{
    children: React.ReactNode,
    loading: boolean,
    loadingOn: () => void,
    loadingOff: () => void
}> = ({ children, loading = false, loadingOn, loadingOff }) => {

    return (
        <>
            <LayoutHeader />
            {children}
        </>
    )
}

export default AppLayout;