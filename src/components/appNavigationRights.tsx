import React from "react"
import { useNavigate } from "react-router-dom";


const Navigate: React.ComponentType<{ 
    children: React.ReactNode, 
    path: string,
    onClick: () => void 
}> = ({ 
    children, 
    path = '', 
    onClick = () => {} 
}) => {
    
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <span 
                onClick={() => {
                    navigate(path);
                    onClick();
                }}
            >{children}</span>
        </React.Fragment>
    )
}

export default Navigate