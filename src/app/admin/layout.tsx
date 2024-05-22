import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Sidebar from "@components/Sidebar";
import style from "@styles/admin/layout.module.css";
import TabBar from "../components/TabBar";
import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";
import { getUserDbDataRevamp, getUserRoleFromEmail } from "app/dashboard/page";
import { cookies } from "next/headers";
type Props = {
  children: ReactNode;
};

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300"] });
const Layout = async (props: Props) => {
 
    // get user if possible

    if (process.env.DEV_MODE != "true"){
        // get user role
        console.log('admin getting user')
        const email = cookies().get('user_email')?.value
        const admin = cookies().get('admin')?.value
        if (email && (admin == 'super_secret')){
            console.log('cookie found, getting role')
            const user = await getUserRoleFromEmail(email)
            console.log('validated role')
            if (user != "admin"){
                redirect("/dashboard")
            }
        }
        else{
            redirect('/dashboard')
        }
    }

  return (
    <>

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
