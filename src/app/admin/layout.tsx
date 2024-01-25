import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Sidebar from "@components/Sidebar";
import style from "@styles/admin/layout.module.css";

type Props = {
  children: ReactNode;
};

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300"] });

const Layout = (props: Props) => {
  return (
    <div className={montserrat.className}>
      <div className={style.adminDash}>
        <div>
          <Sidebar/>
        </div>
        <main className={style.mainContainer}>{props.children}</main>
      </div>
    </div>
  );
};

export default Layout;
