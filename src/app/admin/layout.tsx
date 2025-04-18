import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Sidebar from "app/components/navigation/Sidebar";
import style from "@styles/admin/layout.module.css";
import TabBar from "../components/navigation/TabBar";
import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { BareBoneIUser } from "app/components/navbar/NavbarParents";
type Props = {
  children: ReactNode;
};

const getUserRoleFromId = async(id: string) => {
    await connectDB()
    try {
        const user: IUser= await User.findOne({ _id: id}, 'role').lean().orFail() as IUser;
        return user.role
    }
    catch (err) {
        
        return 'guest'
    }
}
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300"] });
const Layout = async (props: Props) => {
 
    // get user if possible

    if (process.env.DEV_MODE != "true"){
        // get user role
        
        const res = cookies().get('user')?.value
        
        if (res){
            const cookieUser = JSON.parse(res) as BareBoneIUser
            
            const user = await getUserRoleFromId(cookieUser?._id)
            
            if (user != "admin" && user != "super-admin"){
                redirect("/")
            }
        }
        else{
            redirect('/')
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
