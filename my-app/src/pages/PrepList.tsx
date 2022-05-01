import { DefaultButton, PrimaryButton, Stack, StackItem, Text } from '@fluentui/react';
import { useContext, useEffect, useState } from 'react';
import useWindowDimensions, { BaseUrl } from '../utilities';
import AddCategory from './AddCategory';
import AddTaskDialog from './AddTaskDialog';
import { UserContext } from './Dashboard';
import PrepListTasks from './PrepListTasks';

function PrepList() {
    const [categories, setCategories] = useState<any[]>([]);
    const [chefs, setChefUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([])
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const user = useContext(UserContext);

    const viewPort = useWindowDimensions();

    useEffect(() => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/tasks`)
            .then(response => response.json())
            .then(json => setTasks(json.tasks));

        fetch(`${BaseUrl}/chefs`)
            .then(response => response.json())
            .then(json => setChefUsers(json.chefs));
    }, []);

    return (
        <Stack tokens={{ childrenGap: "30px" }}>
            <Text variant='xxLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Prep List</Text>
            <Stack wrap horizontal={true} tokens={{ childrenGap: "20px" }}>
                {categories.map((category, index) => {
                    return (
                        <StackItem key={index} styles={{ root: { textAlign: "center", borderRadius: "16px", padding: "5px", backgroundColor: "purple", width: "120px", fontWeight: "bold", color: "white", border: "1px solid black" } }}>
                            {category.name}
                        </StackItem>
                    )
                })}
                {user?.userType === "Admin" && (
                    <StackItem>
                        <DefaultButton onClick={() => { setShowCategoryDialog(true) }} styles={{ root: { borderRadius: "16px" } }} key="addCategory" text="Add Category" iconProps={{ iconName: "Add" }} />
                    </StackItem>
                )}
            </Stack>
            <StackItem>
                <PrepListTasks tasks={tasks} chefs={chefs} />
            </StackItem>
            <StackItem align='end'>
                <AddTaskDialog categories={categories} setTasks={setTasks} chefs={chefs} />
            </StackItem>
            <AddCategory
                showCategoryDialog={showCategoryDialog}
                setCategories={setCategories}
                setShowCategoryDialog={setShowCategoryDialog} />
        </Stack>
    )
}

export default PrepList;