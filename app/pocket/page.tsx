'use client';
import Nav from '../components/Nav'
import ThemeMenu from '../components/ThemeMenu';
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ThemePack, bubbleTheme, dopplerTheme, goldTheme, sunsetTheme, roseTheme } from "../util/Theme";
import Grid from '../components/Grid';

export default function Home() {
  const [ theme, selectTheme ] = useState("");
  const [ themePack, setThemePack ] = useState<ThemePack>(goldTheme);
  const [ prevTheme, setPrevTheme ] = useState<ThemePack>(goldTheme);
  const [ mobileMenu, setMobileMenu ] = useState(false);
  const [ themeSelected, setThemeSelected ] = useState(true);
  const map = new Map();
  map.set(bubbleTheme.name, bubbleTheme);
  map.set(goldTheme.name, goldTheme);
  map.set(sunsetTheme.name, sunsetTheme);
  map.set(dopplerTheme.name, dopplerTheme);
  map.set(roseTheme.name, roseTheme);

  const handleSelectTheme = (data: string) => {
    selectTheme(theme);
    const tp = map.get(data);
    if (tp === undefined) {
        setThemePack(prevTheme);
    } else {
      setPrevTheme(tp);
      setThemePack(tp);      
    }
  }

  const openToggleMenu = (status: boolean) => {
    setMobileMenu(status);
  };

  useEffect(()=>{
  }, []);

  return (
     <div className={"min-h-screen " + themePack.background }>
     <Nav openToggleMenu={openToggleMenu} wave={"no"} themePack={themePack}/>
     <div className={themePack ? "body " + themePack.background : "body mt-4"}>
      <motion.div initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className={themePack ? !mobileMenu ? " h-[80%] " + themePack.font2 : " h-[80%] hidden " + themePack.font2 : "border h-[80%]"}>
            { !themeSelected ? <ThemeMenu handleSelectThemeSuper={handleSelectTheme} themePack={themePack} selectTheme={handleSelectTheme} confirmTheme={setThemeSelected} /> : ""}
           { themeSelected ? <Grid /> : ""}
        </motion.div>
     </div>
     <div className={mobileMenu ? "" : "hidden"}>
     <nav className={"fixed top-0 left-0 h-screen w-screen " + themePack.background + " " + themePack.font2 }>
      <div className="pl-18 pt-18">
        <div className="flex">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        <button onClick={() => setMobileMenu(false) } className="text-3xl font-bold ml-20">x</button>
        </div>
        <ul className="space-y-2">
          <li><a href="https://sohn.cloud/epub" className={"block py-2 font-bold rounded hover:" + themePack.background}>Home</a></li>
          <li><a href="https://github.com/sohndotcloud/sohn.cloud" className={"block py-2 font-bold rounded hover:" + themePack.background}>About</a></li>
          <li><a href="https://github.com/sohndotcloud" className={"block py-2 font-bold rounded hover:" + themePack.background}>Portfolio</a></li>
          <li><a href="https://linkedin.com/in/nils-sohn" className={"block py-2 font-bold rounded hover:" + themePack.background}>Contact</a></li>
          <li><a href="/api/logout/" className={"block py-2 font-bold rounded hover:" + themePack.background}>Logout</a></li>
        </ul>
      </div>
    </nav>
    </div>
     </div>
  );
}

