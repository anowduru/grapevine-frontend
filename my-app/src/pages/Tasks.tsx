import React, { useState, useContext, useLayoutEffect } from 'react';
import { BaseUrl, formatDate } from '../utilities';
import { addDays, DetailsList, DetailsRow, IColumn, IDetailsRowProps, SelectionMode } from '@fluentui/react';
import { UserContext } from './Dashboard';
import EditTaskDialog from './EditTaskDialog';

function Tasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState("");
    const user = useContext(UserContext);

    const loadData = () => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/tasks`)
            .then(response => response.json())
            .then(json => { setTasks(json.tasks); });
    };

    useLayoutEffect(() => {
        loadData();
    }, [])


    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Task',
            fieldName: 'name',
            minWidth: 100,
            maxWidth: 150,
            isRowHeader: true,
            isSortedDescending: false,
        },
        {
            key: 'column2',
            name: 'Category',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 150,
            isRowHeader: true,
            isSortedDescending: false,
        },
        {
            key: 'column3',
            name: 'QTY',
            fieldName: 'quantity',
            minWidth: 50,
            maxWidth: 70,
        },
        {
            key: 'column4',
            name: 'Due Date',
            fieldName: 'dueDate',
            minWidth: 60,
            maxWidth: 120,
            isCollapsible: true
        },
        {
            key: 'column5',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 60,
            maxWidth: 100,
            isCollapsible: true
        },
        {
            key: 'column6',
            name: 'Status',
            fieldName: 'status',
            minWidth: 60,
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
                categoryName: categories.find(c => c._id === task.category).name,
                status: task.status,
                priority: task.priority,
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
                    return <span>{item.categoryName}</span>;
                case 'column3':
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
                    let style = {};
                    if (item.priority === "High")
                        style = { "color": "red", "fontWeight": "bold" }
                    else if (item.priority === "Medium")
                        style = { "color": "orange", "fontWeight": "bold" }
                    else if (item.priority === "Low")
                        style = { "color": "green", "fontWeight": "bold" }
                    return <span style={style}>{item.priority}</span>;
                case 'column6':
                    const pillStyle = {
                        color: "black",
                        borderRadius: "16px",
                        fontWeight: "bold",
                        padding: "10px",
                        width: "73px"
                    };
                    if (item.status === "NOTSTARTED")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#C4C4C4" }}>Yet to Begin</div>;
                    else if (item.status === "DONE")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#00D053" }}>Done</div>;
                    else if (item.status === "INPROGRESS")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#2DC0FF" }}>In Progress</div>;
                    break;
            }
        }
    }

    const onItemInvoked = (item: any) => {
        setSelectedTask(item.id);
        setShowEditDialog(true);
    };

    const onRefreshTasks = (tasks: any) => {
        setSelectedTask("");
        setTasks(tasks)
    }

    const onRenderRow = (props?: IDetailsRowProps): JSX.Element => {
        return (
            <div onClick={() => { onItemInvoked(props?.item) }}>
                {props && <DetailsRow {...props} />}
            </div>
        );
    }

    return (
        <>
            <DetailsList
                columns={columns}
                items={items}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={onRenderItemColumn}
                onRenderRow={onRenderRow}
            >
            </DetailsList>
            <EditTaskDialog refreshTasks={onRefreshTasks} selectedTaskId={selectedTask} showDialog={showEditDialog} setShowDialog={setShowEditDialog} />
        </>
    )
}

export default Tasks;