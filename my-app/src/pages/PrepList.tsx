import { DefaultButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import { useContext, useEffect, useState } from 'react';
import { BaseUrl } from '../utilities';
import AddCategory from './AddCategory';
import AddTaskDialog from './AddTaskDialog';
import { UserContext } from './Dashboard';
import PrepListTasks from './PrepListTasks';

function PrepList() {
    const [categories, setCategories] = useState<any[]>([]);
    const [chefs, setChefUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [fiterText, setFilterText] = useState('');
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const user = useContext(UserContext);

    useEffect(() => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/tasks`)
            .then(response => response.json())
            .then(json => { setTasks(json.tasks); setFilteredTasks(json.tasks); });

        fetch(`${BaseUrl}/chefs`)
            .then(response => response.json())
            .then(json => setChefUsers(json.chefs));
    }, []);

    const handleFilterChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFilterText(newValue ?? "");
        const items = newValue !== "" ? tasks.filter(t => t.name.toLowerCase().indexOf(newValue?.toLowerCase()) > -1) : tasks;
        setFilteredTasks(items);
    }

    return (
        <Stack tokens={{ childrenGap: "30px" }}>
            <Text variant='xxLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Prep List</Text>
            <Stack horizontal={true} tokens={{ childrenGap: "80px" }}>
                <TextField label="Filter by task" value={fiterText} onChange={handleFilterChange} />
                {user?.userType === "Admin" && (
                    <StackItem styles={{ root: { paddingTop: "25px" } }}>
                        <DefaultButton onClick={() => { setShowCategoryDialog(true) }} styles={{ root: { borderRadius: "16px" } }} key="addCategory" text="Add Category" iconProps={{ iconName: "Add" }} />
                    </StackItem>
                )}
            </Stack>
            <StackItem>
                <PrepListTasks tasks={filteredTasks} chefs={chefs} setTasks={setTasks} />
            </StackItem>
            <StackItem align='end'>
                <AddTaskDialog categories={categories} setTasks={setTasks} chefs={chefs} />
            </StackItem>
            <AddCategory
                showCategoryDialog={showCategoryDialog}
                setCategories={setCategories}
                setShowCategoryDialog={setShowCategoryDialog} />
        </Stack >
    )
}

export default PrepList;