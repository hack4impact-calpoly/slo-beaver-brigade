import { Suspense } from "react";
import Login from "./loginComponent";

export default function Page(){
    return (
        <Suspense>
            <Login/>
        </Suspense>
    )
}