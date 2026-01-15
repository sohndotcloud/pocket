'use client'
import React, {useState} from 'react'
import { ThemePack } from '../util/Theme';

interface ThemeMenuProps {
    themePack: ThemePack;
    selectTheme: (data: string) => void;
    handleSelectThemeSuper: (data: string) => void;
    confirmTheme: (data: boolean) => void;
}

const ThemeMenu = ({ themePack, selectTheme, confirmTheme }: ThemeMenuProps) => {

    const menuItems = ["Doppler Theme", "Sunset Theme" ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [marketOpen, setMarketOpen] = useState(false);
    const [menuItemsState, setMenuItems] = useState(menuItems);

    const handleSelectTheme = (index: number) => {
        setSelectedIndex(index);
        selectTheme(menuItemsState[index]);
    }

    const exitMarket = () => {
        setMarketOpen(false);
    }

    const setMarketOpenTrue = () => {
        setMarketOpen(true);
    }

    const downloadTheme = (theme: string) => {
        if(!menuItemsState.includes(theme)) {
            menuItemsState.push(theme);
            setMenuItems(menuItemsState);
            setSelectedIndex(-1);
        }
    }

    return (
        <div>Select a theme: 
            <div id="menu" className="border pb-5">
                {menuItemsState.map((item, index) => (
                    <div
                        key={index}
                        className={`${selectedIndex === index 
                            ? 'selected ' +  themePack.background2 + ' ' + themePack.font3 : ''}`} 
                        onClick={() => handleSelectTheme(index)} >
                            {item}
                            </div>
                ))}
            </div>
            <button onClick={() => confirmTheme(true)} className="px-5 border" type="button">Select</button>
        </div>
    )
}

export default ThemeMenu
