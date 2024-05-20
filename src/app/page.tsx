import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";
import { getUserDbDataRevamp } from "./dashboard/page";

export default async function Page() {
    // get user role
    const user = await getUserDbDataRevamp()
    if (user){
        if (user?.role == "admin"){
            redirect("/admin/events")
        }
    }

    redirect("/dashboard")
}

