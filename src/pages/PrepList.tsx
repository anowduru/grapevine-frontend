import { Dropdown, IconButton, IContextualMenuProps, IDropdownOption, Stack, StackItem, Text, TextField } from '@fluentui/react';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import useWindowDimensions, { BaseUrl } from '../utilities';
import AddCategory from './AddCategory';
import AddTaskDialog from './AddTaskDialog';
import { UserContext } from './Dashboard';
import PrepListTasks from './PrepListTasks';

function PrepList() {
    const [categories, setCategories] = useState<any[]>([]);
    const [category, setCategory] = useState<string | number>('');
    const [chefs, setChefUsers] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [fiterText, setFilterText] = useState('');
    const [fiterCriteria, setFiterCriteria] = useState('task');
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const user = useContext(UserContext);

    const viewPort = useWindowDimensions();
    const isSmallViewPort = ["s", "m", "l"].includes(viewPort);

    const loadData = () => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/chefs`)
            .then(response => response.json())
            .then(json => setChefUsers(json.chefs));

        fetch(`${BaseUrl}/tasks`)
            .then(response => response.json())
            .then(json => { setTasks(json.tasks); setFilteredTasks(json.tasks); });
    };

    useLayoutEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        setFilteredTasks(tasks);
        setFilterText('');
    }, [tasks])

    const handleFilterChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setFilterText(newValue ?? "");
        if (fiterCriteria === 'task') {
            const items = newValue !== "" ? tasks.filter(t => t.name.toLowerCase().indexOf(newValue?.toLowerCase()) > -1) : tasks;
            setFilteredTasks(items);
        } else {
            const filteredCategoriesIds = newValue !== "" ? categories.filter(c => c.name.toLowerCase().indexOf(newValue?.toLowerCase()) > -1).map(c => c._id) : categories.map(c => c._id);
            const items = newValue !== "" ? tasks.filter(t => filteredCategoriesIds.includes(t.category)) : tasks;
            setFilteredTasks(items);
        }
    }

    const handleCategoryChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setCategory(option?.key ?? "");
    }

    const dropDownOptions = categories.map(category => {
        return { "key": category._id, "text": category.name }
    });

    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'category',
                text: 'Filter by Category',
                onClick: () => setFiterCriteria('category')
            },
            {
                key: 'task',
                text: 'Filter by Task',
                onClick: () => setFiterCriteria('task')
            },
        ],
        directionalHintFixed: true,
    };


    return (
        <Stack tokens={{ childrenGap: "30px" }}>
            <Text variant='xxLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Prep List</Text>
            <Stack horizontal={!isSmallViewPort} horizontalAlign="space-between" tokens={{ childrenGap: "20px" }}>
                <StackItem styles={{ root: { paddingTop: "25px" } }}>
                    <AddTaskDialog categories={categories} setTasks={setTasks} chefs={chefs} />
                </StackItem>
                <Stack horizontal={true} styles={{ root: { paddingTop: "25px" } }}>
                    <Dropdown
                        options={dropDownOptions}
                        selectedKey={category}
                        placeholder="Categories"
                        onChange={handleCategoryChange}
                        styles={{ root: { width: "250px" } }}
                    />
                    {user?.userType === "Admin" && (
                        <IconButton onClick={() => { setShowCategoryDialog(true) }} styles={{ root: { borderRadius: "16px" } }} key="addCategory" text="Add Category" iconProps={{ iconName: "Add" }} />
                    )}
                </Stack>
                <Stack horizontal>
                    <TextField label={`Filter by ${fiterCriteria}`} value={fiterText} onChange={handleFilterChange} />
                    <StackItem styles={{ root: { paddingTop: "25px" } }}>
                        <IconButton iconProps={{ iconName: "Filter" }} menuProps={menuProps} />
                    </StackItem>
                </Stack>
            </Stack>
            <StackItem>
                <PrepListTasks categories={categories} tasks={filteredTasks} chefs={chefs} setTasks={setTasks} />
            </StackItem>
            <AddCategory
                showCategoryDialog={showCategoryDialog}
                setCategories={setCategories}
                setShowCategoryDialog={setShowCategoryDialog} />
        </Stack >
    )
}

export default PrepList;