import { INavLinkGroup, INavStyles, Nav, Stack, StackItem } from '@fluentui/react';
import { createContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PreplistImg from "../images/Preplist.png";
import InventoryImg from "../images/Inventory.png";
import OrdersImg from "../images/Orders.png";
import RecipesImg from "../images/Recipes.png";
import TaskImg from "../images/Tasks.png";
import * as Jwt from 'jsonwebtoken';
import UserInfoPanel from './UserInfoPanel';
import useWindowDimensions from '../utilities';
import PrepList from './PrepList';
import ArchivedV2 from './ArchivedV2';
import styles from '../Stylesheets/scss/dashboard.module.scss'
import TasksV2 from './TasksV2';

export const UserContext = createContext({} as any);

function Dashboard() {

    const navigate = useNavigate();
    const [user, setUser] = useState<any>();
    const navStyles: Partial<INavStyles> = {
        root: {
            // width: 150,
            padding: 20,
            boxSizing: 'border-box',
            overflowY: 'auto',
        },
    };

    const viewPort = useWindowDimensions();
    const isSmallViewPort = ["s", "m", "l"].includes(viewPort);

    const navLinkGroups: INavLinkGroup[] = [
        {
            links: [
                {
                    name: 'Prep list',
                    url: '',
                    onClick: () => { navigate('preplist') },
                    key: 'prepList',
                    iconProps: {
                        imageProps: {
                            src: PreplistImg,
                            height: "100%"
                        }
                    }
                },
                {
                    name: 'My tasks',
                    url: '',
                    onClick: () => { navigate('tasks') },
                    key: 'task',
                    iconProps: {
                        imageProps: {
                            src: TaskImg,
                            height: "100%"
                        }
                    }
                },
                {
                    name: 'Recipes',
                    url: '',
                    key: 'recipes',
                    disabled: true,
                    iconProps: {
                        imageProps: {
                            src: RecipesImg,
                            height: "100%"
                        }
                    }
                },
                {
                    name: 'Inventory',
                    url: '',
                    key: 'inventory',
                    disabled: true,
                    iconProps: {
                        imageProps: {
                            src: InventoryImg,
                            height: "100%"
                        }
                    }
                },
                {
                    name: 'Orders',
                    url: '',
                    key: 'orders',
                    disabled: true,
                    iconProps: {
                        imageProps: {
                            src: OrdersImg,
                            height: "100%"
                        }
                    }
                },
                {
                    name: 'Archived Tasks',
                    url: '',
                    onClick: () => { navigate('archivedTasks') },
                    key: 'archivedTasks',
                }
            ],
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userDecoded = Jwt.decode(token) as any;
            setUser(userDecoded);
        }
        else {
            navigate('/');
        }
    }, [navigate])

    return (
        <UserContext.Provider value={user}>
            <UserInfoPanel />
            <Stack
                horizontal={!isSmallViewPort}
                tokens={{ childrenGap: "20px" }}
                styles={{
                    root: {
                        height: '100%'
                    }
                }}
            >
                <StackItem styles={{ root: { width: "250px", backgroundColor: "white", boxShadow: '0px 15px 10px 3px lightgrey' } }}>
                    <Nav
                        ariaLabel="Grapevine navigation"
                        styles={navStyles}
                        groups={navLinkGroups}

                    />
                </StackItem>
                <StackItem className={styles['right-container']}>
                    <div>
                        <Routes>
                            <Route path='prepList' element={<PrepList />} />
                            <Route path='tasks' element={<TasksV2 />} />
                            <Route path='archivedTasks' element={<ArchivedV2 />} />
                        </Routes>
                    </div>
                </StackItem>
            </Stack>
        </UserContext.Provider>
    )
}

export default Dashboard;