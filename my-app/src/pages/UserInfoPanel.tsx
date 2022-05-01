import { Facepile, Link, PersonaSize, Stack } from "@fluentui/react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Dashboard"

function UserInfoPanel() {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const onClickLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <>
            {user && (
                <div style={{ position: "absolute", top: 15, right: 0 }}>
                    <Stack horizontal>
                        <Facepile personaSize={PersonaSize.size40} personas={[{ imageInitials: user.userName[0] }]} />
                        <Link onClick={onClickLogout}>Logout</Link>
                    </Stack>
                </div>
            )
            }
        </>
    )
}

export default UserInfoPanel