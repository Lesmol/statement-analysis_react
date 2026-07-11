import {useEffect, useState} from "react"
import {userService} from "@/api/services/user/user-service.ts"

const WelcomePage = () => {
    const [username, setUsername] = useState("")

    useEffect(() => {
        userService.getUser().then((result) => {
            if (result.status === "ok") {
                setUsername(result.data.username)
            }
        })
    }, [])

    return (
        <div>
            Welcome {username}
        </div>
    )
}

export default WelcomePage;
