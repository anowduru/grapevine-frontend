import { addDays, DatePicker, Dialog, Dropdown, Facepile, IDropdownOption, ISelectableOption, PersonaSize, PrimaryButton, Stack, StackItem, TextField } from "@fluentui/react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../utilities";

interface EditTaskProps {
    showDialog: boolean,
    setShowDialog: any,
    selectedTaskId: any,
    chefs?: any[]
};

const EditTaskDialog: React.FC<EditTaskProps> = ({
    showDialog,
    setShowDialog,
    chefs,
    selectedTaskId
}) => {

    const todayDate = new Date(Date.now());
    const [category, setCategory] = useState<string | number>('');
    const [status, setStatus] = useState<string | number>('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [dueDate, setDueDate] = useState<Date>(addDays(todayDate, 1));
    const [taskTitle, setTaskTitle] = useState('');
    const [selectedChefs, setSelectedChefs] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/tasks/${selectedTaskId}`)
            .then(response => response.json())
            .then(json => {
                const task = json.task;
                if (task) {
                    setCategory(task.category);
                    setQuantity(task.quantity);
                    setNotes(task.notes);
                    setTaskTitle(task.name);
                    setStatus(task.status)
                    setSelectedChefs(task.assignedTo);
                    console.log(new Date(task.dueDate))
                    setDueDate(new Date(task.dueDate));
                }
            });
    }, [selectedTaskId])

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

        if (status === "") {
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
                id: selectedTaskId,
                taskTitle,
                category,
                dueDate,
                notes,
                selectedChefs,
                quantity,
                status
            })
        })

        const data = await response.json();

        if (data) {
            setCategory('');
            setQuantity('');
            setNotes('');
            setTaskTitle('');
            setStatus('');
            setSelectedChefs([]);
            setDueDate(addDays(todayDate, 1))
        }
    };
    const dropDownOptions = categories.map(category => {
        return { "key": category._id, "text": category.name }
    });

    const chefDropDownOptions = chefs ? chefs.map(chef => {
        return { "key": chef._id, "text": chef.name }
    }) : [];

    const statusDropDown = [
        { "key": "NOTSTARTED", "text": "Yet to begin" },
        { "key": "DONE", "text": "Done" },
        { "key": "INPROGRESS", "text": "In Progress" }
    ]

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

    const handleStatusChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setStatus(option?.key ?? "");
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
            <Dialog minWidth={"500px"} isBlocking={true} hidden={!showDialog} onDismiss={() => { setShowDialog(false) }}>
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
                        {chefs && (
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
                        )}
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
                        placeholder="Select status"
                        selectedKey={status}
                        options={statusDropDown}
                        onChange={handleStatusChange}
                        styles={{ root: { width: "150px" } }}
                    />
                    <TextField placeholder='Notes' multiline underlined={true} value={notes} onChange={handleNotesChange} />
                    <StackItem align='end'>
                        <PrimaryButton style={{ backgroundColor: "purple", width: "150px", borderRadius: "16px" }} text='Update' onClick={onClickAdd}></PrimaryButton>
                    </StackItem>
                </Stack>
            </Dialog>
        </>
    )
}

export default EditTaskDialog;