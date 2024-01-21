import { ReactNode } from "react";
import Sidebar from "@components/Sidebar";
import style from '@styles/adminStyle/layout.module.css'

type Props = {
    children: ReactNode;
}

const layout = (props: Props) => {
    return (
      <div className={style.adminDash}>
        <div>
            <Sidebar/>
        </div>
        <main className={style.mainContainer}>
            {props.children}
        </main>
      </div>
    );
  };
  
  export default layout;
  