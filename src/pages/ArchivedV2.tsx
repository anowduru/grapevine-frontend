import React, { useState, useEffect } from 'react';
import { BaseUrl, formatDate } from '../utilities';
import { addDays, Stack, Text } from '@fluentui/react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { Column } from './PrepListTasksV2';

const columns: readonly Column[] = [
    { key: 'name', name: 'Task', fieldName: 'name', minWidth: 170 },
    { key: 'categoryName', name: 'Category', fieldName: 'categoryName', minWidth: 100 },
    {
        key: 'quantity',
        name: 'QTY',
        minWidth: 50,
        fieldName: 'quantity'
    },
    {
        key: 'dueDate',
        name: 'Due Date',
        fieldName: 'dueDate',
        minWidth: 50
    },
    {
        key: 'priority',
        name: 'Priority',
        minWidth: 50,
        fieldName: 'priority'
    },
    {
        key: 'status',
        name: 'Status',
        minWidth: 170,
        fieldName: 'status'
    }
];


function ArchivedV2() {
    const [tasks, setTasks] = useState<any[]>([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));

        fetch(`${BaseUrl}/archivedTasks`)
            .then(response => response.json())
            .then(json => setTasks(json.tasks));
    }, []);

    const rows = tasks.map((task, index) => {
        return {
            rowId: index.toString(),
            id: task._id,
            name: task.name,
            quantity: task.quantity,
            categoryName: categories?.find(c => c._id === task.category)?.name,
            assignedTo: task.assignedTo,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate
        }
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const onRenderItemColumn = (item?: any, column?: any) => {
        if (column) {
            switch (column.key) {
                case 'name':
                    return <span>{item.name}</span>;
                case 'categoryName':
                    return <span>{item.categoryName}</span>;
                case 'quantity':
                    return <span>{item.quantity} Pcs</span>;
                case 'dueDate':
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
                case 'priority':
                    let style = {};
                    if (item.priority === "High")
                        style = { "color": "red", "fontWeight": "bold" }
                    else if (item.priority === "Medium")
                        style = { "color": "orange", "fontWeight": "bold" }
                    else if (item.priority === "Low")
                        style = { "color": "green", "fontWeight": "bold" }
                    return <span style={style}>{item.priority}</span>;
                case 'status':
                    const pillStyle = {
                        color: "black",
                        borderRadius: "16px",
                        fontWeight: "bold",
                        padding: "10px"
                    };
                    if (item.status === "NOTSTARTED")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#C4C4C4", whiteSpace: "nowrap" }}>Yet to Begin</div>;
                    else if (item.status === "DONE")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#00D053", whiteSpace: "nowrap" }}>Done</div>;
                    else if (item.status === "INPROGRESS")
                        return <div style={{ ...pillStyle, textAlign: "center", backgroundColor: "#2DC0FF", whiteSpace: "nowrap" }}>In Progress</div>;
                    break;
            }
        }
    }

    return (
        <Stack tokens={{ childrenGap: "30px" }}>
            <Text variant='xxLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Archived</Text>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover tabIndex={-1} key={row?.id}>
                                            {columns.map((column) => {
                                                return (
                                                    <TableCell key={column.key}>
                                                        {onRenderItemColumn(row, column)}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Stack>
    )
}

export default ArchivedV2;