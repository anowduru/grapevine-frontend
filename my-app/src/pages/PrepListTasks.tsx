import { addDays, DetailsList, Facepile, IColumn, PersonaSize, SelectionMode } from "@fluentui/react";
import { useState } from "react";
import { formatDate } from "../utilities";
import EditTaskDialog from "./EditTaskDialog";

interface TaskListProps {
    tasks: any[],
    chefs: any[]
}
const PrepListTasks: React.FC<TaskListProps> = ({
    tasks,
    chefs
}) => {
    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Task',
            fieldName: 'name',
            minWidth: 100,
            maxWidth: 200,
            isRowHeader: true,
            isSorted: true,
            isSortedDescending: false,
        },
        {
            key: 'column2',
            name: 'QTY',
            fieldName: 'quantity',
            minWidth: 70,
            maxWidth: 90,
        },
        {
            key: 'column3',
            name: 'CHEF',
            fieldName: 'assignedTo',
            minWidth: 70,
            maxWidth: 120,
        },
        {
            key: 'column4',
            name: 'Due Date',
            fieldName: 'dueDate',
            minWidth: 70,
            maxWidth: 150,
            isCollapsible: true
        }, {
            key: 'column5',
            name: 'Status',
            fieldName: 'status',
            minWidth: 70,
            maxWidth: 120,
            isCollapsible: true
        }
    ];

    const items = tasks.map((task, index) => {
        return {
            key: index.toString(),
            id: task._id,
            name: task.name,
            quantity: task.quantity,
            assignedTo: task.assignedTo,
            status: task.status,
            dueDate: task.dueDate
        }
    });

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState("");

    const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
        if (column) {
            switch (column.key) {
                case 'column1':
                    return <span>{item.name}</span>;
                case 'column2':
                    return <span>{item.quantity} Pcs</span>;

                case 'column3':
                    const divStyle: React.CSSProperties = { "width": "100%", "display": "flex" };
                    return (
                        <div style={divStyle}>
                            {
                                (item.assignedTo as string[]).map((chef, index) => {
                                    return <Facepile key={index} personaSize={PersonaSize.size24} personas={[{ imageInitials: chefs?.find(c => c._id === chef)?.name[0] }]} />
                                })
                            }
                        </div>
                    );

                case 'column4':
                    const dueDate = new Date(item.dueDate).setHours(0, 0, 0, 0);
                    const todayDate = new Date().setHours(0, 0, 0, 0);
                    const tomrrowDate = addDays(new Date(), 1).setHours(0, 0, 0, 0);
                    if (dueDate === todayDate)
                        return <span>Today</span>;
                    else if (dueDate === tomrrowDate) {
                        return <span>Tomorrow</span>;
                    }
                    else {
                        return <span>{formatDate(new Date(item.dueDate))}</span>
                    }

                case 'column5':
                    if (item.status === "NOTSTARTED")
                        return <span>Yet to Begin</span>;
                    else if (item.status === "DONE")
                        return <span>Done</span>;
                    if (item.status === "INPROGRESS")
                        return <span>In Progress</span>;
            }
        }
    }

    const onItemInvoked = (item: any, index: number | undefined) => {
        setSelectedTask(item.id);
        setShowEditDialog(true);
    };

    return (
        <>
            <DetailsList
                columns={columns}
                items={items}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={onRenderItemColumn}
                onItemInvoked={onItemInvoked}
            >
            </DetailsList>
            <EditTaskDialog selectedTaskId={selectedTask} showDialog={showEditDialog} setShowDialog={setShowEditDialog} chefs={chefs} />
        </>
    )
}

export default PrepListTasks;