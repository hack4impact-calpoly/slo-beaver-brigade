import { ReactNode } from "react";

type Props = {
    children: ReactNode;
}

const layout = (props: Props) => {
    return (
      <div>
        <div>
            Sidebar
        </div>
        <main>
            {props.children}
        </main>
      </div>
    );
  };
  
  export default layout;
  