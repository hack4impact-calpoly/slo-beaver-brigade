import { ReactNode } from "react";
import { Lato, Montserrat } from "next/font/google";
import Sidebar from "@components/Sidebar_Guest";
import style from "@styles/admin/layout.module.css";

type Props = {
  children: ReactNode;
};

const montserrat = Lato({ subsets: ["latin"], weight: ["300"] });

const Layout = (props: Props) => {
  return (
    <div className={montserrat.className}>
      <div className={style.adminDash}>
        <main className={style.mainContainer}>{props.children}</main>
      </div>
    </div>
  );
};

export default Layout;
