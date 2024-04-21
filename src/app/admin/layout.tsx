import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Sidebar from "@components/Sidebar";
import style from "@styles/admin/layout.module.css";
import TabBar from "../components/TabBar";
import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";
type Props = {
  children: ReactNode;
};

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300"] });
const Layout = async (props: Props) => {
 
    // get user if possible
    const user = await getUserDbData()

    if (process.env.DEV_MODE != "true"){
        if (user?.role != "admin"){
            redirect("/")
        }
    }

  return (
    <>

    <TabBar />
      <div className={montserrat.className}>
        <div className={style.adminDash}>
          <main className={style.mainContainer}>

            {props.children}
        </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
