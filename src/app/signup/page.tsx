import { Suspense } from "react";
import SignUp from "./siignupComponent";

export default function Page(){
    return (
        <Suspense fallback="Loading..">
            <SignUp/>
        </Suspense>
    )
}