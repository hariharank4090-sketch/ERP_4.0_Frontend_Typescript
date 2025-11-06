import React, { createContext, useContext, useMemo, useState } from "react";
import type { MenuTreeNode } from "../utils/menuManagement";

type User = {
    sub: number;
    username: string;
    name?: string | null;
    companyId?: number | null;
    roleId?: number | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    navDetails: MenuTreeNode[];
    setNavDetails: React.Dispatch<React.SetStateAction<MenuTreeNode[]>>;
    currentPage: MenuTreeNode | null;
    setCurrentPage: React.Dispatch<React.SetStateAction<any>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as User) : null;
    });

    const [navDetails, setNavDetails] = useState<MenuTreeNode[]>([]);

    const [currentPage, setCurrentPage] = useState<MenuTreeNode | null>(null);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const value = useMemo(() => ({ 
        user, token, 
        login, logout, 
        navDetails, setNavDetails, 
        currentPage, setCurrentPage 
    }), [user, token, navDetails, currentPage]);
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
