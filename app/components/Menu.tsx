'use client'
import React, { useState} from 'react'
import {motion} from 'framer-motion'
import { ThemePack } from '../util/Theme'

interface MenuButtonProps {
  themePack: ThemePack;
  openToggleMenu: (status: boolean) => void;
}

const MenuButton = ({themePack, openToggleMenu }: MenuButtonProps) => {
  const [ menuStatus, setMenuStatus ] = useState(false);
  const toggleMenu = () => {
    setMenuStatus(!menuStatus);
    openToggleMenu(!menuStatus);
  }

  return (
    <div>
    <motion.div onClick={toggleMenu} initial={{ opacity: 0, y: -25, x: +25}}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: .95 }}
          className="mt-9 mr-10 md:hidden">
        <button className="space-y-1.5" id="menu-button">
        <span className={"block w-6 h-0.5 " + themePack.background2 }></span>
        <span className={"block w-6 h-0.5 " + themePack.background2 }></span>
        <span className={"block w-6 h-0.5 " + themePack.background2 }></span>
        <span className={"block w-6 h-0.5 " + themePack.background2 }></span>
        </button>
    </motion.div>
    <div className="hidden sm:fixed w-full h-full bg-amber-500">

    </div>
    </div>
  )
}

export default MenuButton
