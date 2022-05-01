import React, { useState, useEffect, useContext } from 'react';
import { BaseUrl, formatDate } from '../utilities';
import { addDays, DetailsList, IColumn, SelectionMode } from '@fluentui/react';
import { UserContext } from './Dashboard';
import EditTaskDialog from './EditTaskDialog';

function Tasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState("");
    const user = useContext(UserContext);

    useEffect(() => {
        fetch(`${BaseUrl}/tasks`)
            .then(response => response.json())
            .then(json => setTasks(json.tasks));
    }, []);

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
    const [showEditDialog, setShowEditDialog] = useState(false);

    const items = user ? tasks.map((task, index) => {
        if ((task.assignedTo as string[]).includes(user.id)) {
            return {
                key: index.toString(),
                id: task._id,
                name: task.name,
                quantity: task.quantity,
                assignedTo: task.assignedTo as any[],
                status: task.status,
                dueDate: task.dueDate
            }
        } else {
            return undefined
        }
    }).filter(x => x !== undefined) : [];

    const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
        if (column) {
            switch (column.key) {
                case 'column1':
                    return <span>{item.name}</span>;
                case 'column2':
                    return <span>{item.quantity} Pcs</span>;
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
            <EditTaskDialog selectedTaskId={selectedTask} showDialog={showEditDialog} setShowDialog={setShowEditDialog} />
        </>
    )
}

export default Tasks;