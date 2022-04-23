import { INavLinkGroup, INavStyles, Nav, Stack, StackItem } from '@fluentui/react';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrepList from './PrepList';
import Tasks from './Tasks';
import PreplistImg from "../images/Preplist.png";
import InventoryImg from "../images/Inventory.png";
import OrdersImg from "../images/Orders.png";
import RecipesImg from "../images/Recipes.png";
import TaskImg from "../images/Tasks.png";

function Dashboard() {
    const navStyles: Partial<INavStyles> = {
        root: {
            width: 208,
            height: "100vh",
            boxSizing: 'border-box',
            border: '1px solid #eee',
            overflowY: 'auto',
        },
    };

    //Todo add useEffect

    const navLinkGroups: INavLinkGroup[] = [
        {
            links: [
                {
                    name: 'Prep list',
                    url: '/dashboard/preplist',
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
                    url: '/dashboard/tasks',
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
                }
            ],
        },
    ];

    return (
        <Stack horizontal={true} tokens={{ childrenGap: "50px" }}>
            <StackItem>
                <Nav
                    ariaLabel="Grapevine navigation"
                    styles={navStyles}
                    groups={navLinkGroups}
                />
            </StackItem>
            <StackItem>
                <Routes>
                    <Route>
                        <Route path='/prepList' element={<PrepList />} />
                        <Route path='/tasks' element={<Tasks />} />
                    </Route>
                </Routes>
            </StackItem>
        </Stack>
    )
}

export default Dashboard;