import { getUserDbData } from "app/lib/authentication";
import { redirect } from "next/navigation";

export default async function Page() {
    // get user role
    let user = null
    const res = await getUserDbData()
    if (res){
        user = JSON.parse(res)
    }
    if (user?.role == "admin"){
        redirect("/admin/events")
    }
    redirect("/dashboard")
}

