import { addDays, DatePicker, DefaultButton, Dialog, Dropdown, Facepile, IDropdownOption, ISelectableOption, PersonaSize, PrimaryButton, Stack, StackItem, TextField } from "@fluentui/react";
import { useContext, useState } from "react";
import { BaseUrl } from "../utilities";
import { UserContext } from "./Dashboard";

interface TaskProps {
    categories: any[],
    setTasks: any,
    chefs: any[]
}

const AddTaskDialog: React.FC<TaskProps> = ({
    categories,
    setTasks,
    chefs
}) => {

    const todayDate = new Date(Date.now());
    const user = useContext(UserContext);
    const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
    const [category, setCategory] = useState<string | number>('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState<string | number>("Medium");
    const [dueDate, setDueDate] = useState<Date>(addDays(todayDate, 1));
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedChefs, setSelectedChefs] = useState<string[]>([]);

    const onClickAdd = async () => {
        var isValid = true;
        if (category === "") {
            isValid = false;
        }

        if (quantity.length === 0) {
            isValid = false;
        }

        if (taskTitle.length === 0) {
            isValid = false;
        }

        if (quantity.length === 0) {
            isValid = false;
        }
        if (!isValid) {
            return;
        }
        const response = await fetch(`${BaseUrl}/task`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: "",
                taskTitle,
                category,
                dueDate,
                notes,
                selectedChefs,
                priority,
                quantity
            })
        })

        const data = await response.json();

        if (data) {
            setCategory('');
            setQuantity('');
            setNotes('');
            setTaskTitle('');
            setPriority('Medium');
            setSelectedChefs([]);
            setDueDate(addDays(todayDate, 1))
            setTasks(data.tasks)
            setShowAddTaskDialog(false)
        }
    };

    const priorityDropDown = [
        { "key": "High", "text": "High" },
        { "key": "Medium", "text": "Medium" },
        { "key": "Low", "text": "Low" }
    ];

    const dropDownOptions = categories.map(category => {
        return { "key": category._id, "text": category.name }
    });

    const chefDropDownOptions = chefs.map(chef => {
        return { "key": chef._id, "text": chef.name }
    });

    const handleTaskTitleChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTaskTitle(newValue ?? "");
    }

    const handleQuantityChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setQuantity(newValue ?? "");
    }

    const handleNotesChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNotes(newValue ?? "");
    }

    const handleCategoryChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setCategory(option?.key ?? "");
    }

    const handlePriorityChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setPriority(option?.key ?? "");
    }


    const onAssignChef = (_event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            setSelectedChefs(
                item.selected ? [...selectedChefs, item.key as string] : selectedChefs.filter(key => key !== item.key),
            );
        }
    };

    const onRenderOption = (option?: ISelectableOption): JSX.Element | null => {
        if (option) {
            const divStyle: React.CSSProperties = { "width": "100%", "display": "flex", "justifyContent": "space-between" };
            return (
                <div style={divStyle}>
                    <Facepile personaSize={PersonaSize.size24} personas={[{ imageInitials: option.text[0] }]} />
                    <span>{option.text}</span>
                </div>
            );
        }
        else
            return null;
    };

    const onRenderLabel = (options?: IDropdownOption[]): JSX.Element | null => {
        if (options) {
            const divStyle: React.CSSProperties = { "width": "100%", "display": "flex" };
            return (
                <div style={divStyle}>
                    {
                        options.map((option, index) => {
                            return <Facepile key={index} personaSize={PersonaSize.size24} personas={[{ imageInitials: option.text[0] }]} />
                        })
                    }
                </div>
            )
        }
        else
            return null;
    };

    const datePickerFormatter = (date?: Date) => {
        if (!date) {
            return "";
        }
        const dateOrder = ["month", "day", "year"];
        let ret = "";
        for (const str of dateOrder) {
            switch (str) {
                case "year":
                    ret += `${date.getFullYear()}/`;
                    break;
                case "month":
                    ret += `${date.getMonth() + 1}/`;
                    break;
                case "day":
                    ret += `${date.getDate()}/`;
                    break;
                default:
                    throw new Error("Unknown format for dateOrder");
            }
        }
        return ret.slice(0, -1);
    };

    return (
        <>
            <Dialog minWidth={"500px"} modalProps={{ isBlocking: true }} hidden={!showAddTaskDialog} onDismiss={() => { setShowAddTaskDialog(false) }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <Dropdown
                        placeholder="Select Category"
                        selectedKey={category}
                        options={dropDownOptions}
                        onChange={handleCategoryChange}
                        styles={{ root: { width: "150px" }, title: { borderColor: "transparent", color: "purple" }, dropdownItemSelected: { color: "purple" }, dropdownItem: { color: "purple" } }}
                    />
                    <Stack horizontal={true} tokens={{ childrenGap: "10px" }}>
                        <StackItem styles={{ root: { width: "80%" } }}>
                            <TextField placeholder='Type your task title' underlined={true} value={taskTitle} onChange={handleTaskTitleChange} />
                        </StackItem>
                        <StackItem styles={{ root: { width: "30%" } }}>
                            <TextField placeholder='Quantity' underlined={true} value={quantity} onChange={handleQuantityChange} />
                        </StackItem>
                    </Stack>
                    <Stack horizontal={true} tokens={{ childrenGap: "10px" }}>
                        <StackItem styles={{ root: { width: "80%" } }}>
                            <Dropdown dropdownWidth={"auto"}
                                placeholder="Assign"
                                selectedKeys={selectedChefs}
                                multiSelect
                                options={chefDropDownOptions}
                                onRenderOption={onRenderOption}
                                onRenderTitle={onRenderLabel}
                                onChange={onAssignChef}
                                styles={{ root: { width: "150px" }, title: { borderColor: "transparent", color: "purple" }, dropdownItemSelected: { color: "purple" }, dropdownItem: { color: "purple" } }}
                            />
                        </StackItem>
                        <DatePicker
                            placeholder="Select"
                            value={dueDate}
                            minDate={new Date(Date.now())}
                            onSelectDate={setDueDate as (date: Date | null | undefined) => void}
                            styles={{ root: { width: "50%" } }}
                            formatDate={datePickerFormatter}
                        />
                    </Stack>
                    <Dropdown
                        selectedKey={priority}
                        label="Priority"
                        options={priorityDropDown}
                        onChange={handlePriorityChange}
                        styles={{ root: { width: "150px" }, label: { color: "purple" } }}
                    />
                    <TextField placeholder='Notes' multiline underlined={true} value={notes} onChange={handleNotesChange} />
                    <StackItem align='end'>
                        <PrimaryButton style={{ backgroundColor: "purple", width: "150px", borderRadius: "16px" }} text='Add Task' onClick={onClickAdd}></PrimaryButton>
                    </StackItem>
                </Stack>
            </Dialog>
            {user?.userType === "Admin" &&
                <DefaultButton text="Add Task" onClick={() => { setShowAddTaskDialog(true) }} iconProps={{ iconName: "Add" }} />
            }
        </>
    )
}

export default AddTaskDialog;