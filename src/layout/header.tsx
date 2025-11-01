import { useNavigate } from "react-router-dom";

const LayoutHeader = () => {
    const nav = useNavigate();

    return (
        <header className="flex items-center justify-between px-5 p-3 shadow" style={{ background: "linear-gradient(180deg,#f7f5f8,#f2fbff)" }}>

            <div className="flex items-center gap-4">
                <div
                    className="text-2xl font-semibold"
                    onClick={() => nav('/')}
                >ERP <code className="text-sm text-gray-500">-v{import.meta.env.VITE_APP_VERSION}</code>
                </div>
            </div>

            <div className="text-xl font-medium">Dashboard</div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="3" fill="#6B7280" />
                            <path d="M4 20c0-3.3137 2.6863-6 6-6h4c3.3137 0 6 2.6863 6 6" fill="#6B7280" />
                        </svg>
                    </div>
                    <div className="text-sm text-gray-600">Admin</div>
                </div>
            </div>

        </header>
    )
}

export default LayoutHeader;