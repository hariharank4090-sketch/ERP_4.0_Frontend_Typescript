import type { MenuRow } from "../modules/configuration/types";
import { colors } from "../utils/colors";
import { getMuiIcon } from "../utils/getMuiIcon";
import { randomNumber } from "../utils/helper";

const MainMenuList: React.ComponentType<{ 
    menuData: MenuRow[], 
    loading: boolean, 
    loadingOn: () => void 
    loadingOff: () => void 
}> =({ 
    menuData = [], 
    // loading = false, 
    // loadingOn = () => {},
    // loadingOff = () => {}, 
}) => {
    const onSelect = (item: MenuRow) => {
        console.log("menu selected:", item);
    };

    const getColor = (ind: number) => {
        return colors[ind] ? colors[ind] : colors[randomNumber(colors.length)];
    }

    return (
        <div className="p-6" >
            <main>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                    {menuData.filter((m: MenuRow) => m.parentId ? false : true).map((m: MenuRow, index: number) => {
                        const color = getColor(index);

                        return (
                            <button
                                key={index}
                                onClick={() => onSelect(m)}
                                className="group flex flex-col items-center gap-3 focus:outline-none"
                                aria-label={m.title}
                                style={{ transform: "translateZ(0)" }}
                            >
                                {/* outer soft card */}
                                <div
                                    className="flex items-center justify-center rounded-full w-24 h-24 shadow-soft-outer transition-transform group-hover:-translate-y-1"
                                    style={{
                                        background: `linear-gradient(135deg, ${color.accent}, ${color.color})`,
                                        boxShadow: "12px 12px 24px rgba(0,0,0,0.08), -8px -8px 18px rgba(255,255,255,0.9)",
                                    }}
                                >
                                    {/* inner embossed circle */}
                                    <div
                                        className="rounded-full flex items-center justify-center w-16 h-16"
                                        style={{
                                            background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), rgba(255,255,255,0.3)), ${color.color}`,
                                            boxShadow: "inset 6px 6px 10px rgba(0,0,0,0.06), inset -6px -6px 12px rgba(255,255,255,0.6)",
                                        }}
                                    >
                                        <i style={{ fontSize: 30, color: "#7B3F6B" }} >{getMuiIcon(m.iconKey, {})}</i>
                                    </div>
                                </div>

                                {/* label */}
                                <div className="text-sm text-gray-700 tracking-wide w-28 text-center">{m.title}</div>
                            </button>
                        )
                    })}
                </div>
            </main>

            <style>{`
                .shadow-soft { box-shadow: 6px 6px 18px rgba(0,0,0,0.08), -6px -6px 18px rgba(255,255,255,0.9); }
                .shadow-soft-outer { box-shadow: 10px 12px 26px rgba(0,0,0,0.08), -8px -8px 22px rgba(255,255,255,0.9); }`}
            </style>
        </div>
    );
}

export default MainMenuList;
