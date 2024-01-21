import { ReactNode } from "react";
import Sidebar from "@components/Sidebar";

type Props = {
    children: ReactNode;
}

const layout = (props: Props) => {
    return (
      <div>
        <div>
            <Sidebar/>
        </div>
        <main>
            {props.children}
        </main>
      </div>
    );
  };
  
  export default layout;
  