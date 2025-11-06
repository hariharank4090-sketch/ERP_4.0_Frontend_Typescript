import React from "react";
import { useAuth } from '../auth/authContext';
import type { PageProps } from "../routes/indexRouter";
import { getMenuColor, MenuIconButton } from "./mainMenu";

export const MenuGroupPage: React.ComponentType<PageProps> = ({
    // loading = false, loadingOn, loadingOff
}) => {
    const { currentPage } = useAuth()

    return (
        <>
            {currentPage?.children?.length === 0 ? (
                <p>No sub-menus.</p>
            ) : (
                <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                    {currentPage?.children?.filter(m => m.menuType == 0).map((m, ind) => {
                        const color = getMenuColor(ind);
                        return (
                            <MenuIconButton
                                key={m.menuId}
                                menuObject={m}
                                color={color.color}
                                accent={color.accent}
                            />
                        )
                    })}
                </main>
            )}

            {currentPage?.children?.filter(m => m.menuType == 1).map((m, ind) => (
                <div 
                    key={ind} 
                    className="mb-5 p-4 rounded-3xl"
                    // style={{ background: "linear-gradient(180deg,#f7f5f8,#f2fbff)" }}
                    // style={{ background: "linear-gradient(180deg,#f7f5f8,#f2fbff)" }}
                >
                    <h5 className="mb-5">{m.title}</h5>
                    {/* <hr className="text-blue-200 pb-2" /> */}
                    <div>
                        {m?.children?.length === 0 ? (
                            <p>No sub-menus.</p>
                        ) : (
                            <main className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">

                                {m?.children?.filter(m => m.menuType == 0).map((m, ind) => {
                                    const color = getMenuColor(ind);
                                    return (
                                        <MenuIconButton
                                            key={m.menuId}
                                            menuObject={m}
                                            color={color.color}
                                            accent={color.accent}
                                        />
                                    )
                                })}
                            </main>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};
