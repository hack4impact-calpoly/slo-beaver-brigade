import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";

export default async function Page() {
    // get user role
    const user = await getUserDbData()
    if (user?.role == "admin"){
        redirect("/admin/events")
    }
    redirect("/dashboard")
}

