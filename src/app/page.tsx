import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";

export default async function Page() {
    // get user role
    const userRes = await getUserDbData()
    if (userRes){
        const user = JSON.parse(userRes)
        if (user?.role == "admin"){
            redirect("/admin/events")
        }
    }
    redirect("/dashboard")
}

