import { colors } from "../utils/colors";
import { getMuiIcon } from "../utils/getMuiIcon";
import { randomNumber } from "../utils/helper";
import { useAuth } from '../auth/authContext'
import NavigateButton from "../components/navigationButton";
import type { MenuTreeNode } from "../utils/menuManagement";
import type { PageProps } from "../routes/indexRouter";

export const getMenuColor = (ind: number) => {
    return colors[ind] ? colors[randomNumber(colors.length)] : colors[ind];
}

export const MenuIconButton: React.ComponentType<{
    menuObject: MenuTreeNode,
    color: string,
    accent: string
}> = ({ menuObject, color, accent }) => {
    return (
        <span className="flex justify-center">
            <NavigateButton path={menuObject.fullPath}>
                <button
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                    aria-label={menuObject.title}
                    style={{ transform: "translateZ(0)" }}
                >
                    {/* outer soft card */}
                    <div
                        className="flex items-center justify-center rounded-full w-24 h-24 shadow-soft-outer transition-transform group-hover:-translate-y-1"
                        style={{
                            background: `linear-gradient(135deg, ${accent}, ${color})`,
                            boxShadow: "12px 12px 24px rgba(0,0,0,0.08), -8px -8px 18px rgba(255,255,255,0.9)",
                        }}
                    >
                        {/* inner embossed circle */}
                        <div
                            className="rounded-full flex items-center justify-center w-16 h-16"
                            style={{
                                background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9), rgba(255,255,255,0.3)), ${color}`,
                                boxShadow: "inset 6px 6px 10px rgba(0,0,0,0.06), inset -6px -6px 12px rgba(255,255,255,0.6)",
                            }}
                        >
                            <i style={{ fontSize: 30, color: "#7B3F6B" }} >{getMuiIcon(menuObject.iconKey, {}, menuObject.title)}</i>
                        </div>
                    </div>

                    {/* label */}
                    <div className=" text-md text-gray-700 tracking-wide w-28 text-center">{menuObject.title}</div>
                </button>
            </NavigateButton>

            <style>{`
                .shadow-soft { box-shadow: 6px 6px 18px rgba(0,0,0,0.08), -6px -6px 18px rgba(255,255,255,0.9); }
                .shadow-soft-outer { box-shadow: 10px 12px 26px rgba(0,0,0,0.08), -8px -8px 22px rgba(255,255,255,0.9); }`}
            </style>
        </span>
    )
}

const MainMenuList: React.ComponentType<PageProps> = ({
    // loading = false, 
    // loadingOn = () => {},
    // loadingOff = () => {}, 
}) => {
    const { navDetails } = useAuth();

    return (
        <div>
            <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                {navDetails.filter((m: MenuTreeNode) => (
                    m.parentId && Boolean(m.isVisible) && Boolean(m.isActive)
                ) ? false : true).map((m: MenuTreeNode, index: number) => {
                    const colorValue = getMenuColor(index);

                    return (
                        <MenuIconButton
                            key={index}
                            menuObject={m}
                            color={colorValue.color}
                            accent={colorValue.accent}
                        />
                    )
                })}
            </main>
        </div >
    );
}

export default MainMenuList;
