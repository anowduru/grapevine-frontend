import { Dialog, PrimaryButton, Stack, StackItem, Text, TextField } from "@fluentui/react";
import { useState } from "react";
import useWindowDimensions, { BaseUrl } from "../utilities";

interface CategoryProps {
    showCategoryDialog: boolean,
    setCategories: any,
    setShowCategoryDialog: any,
};

const AddCategory: React.FC<CategoryProps> = ({
    showCategoryDialog,
    setCategories,
    setShowCategoryDialog
}) => {
    const [category, setCategory] = useState('');
    const [procedure, setProcedure] = useState('');
    const [notes, setNotes] = useState('');
    const [categoryErrorMessage, setCategoryErrorMessage] = useState('');
    const [procedureErrorMessage, setProcedureErrorMessage] = useState('');
    const viewPort = useWindowDimensions();

    const handleCategoryChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCategory(newValue ?? "");
        setCategoryErrorMessage("");
    }
    const handleProcedureChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setProcedure(newValue ?? "");
        setProcedureErrorMessage("");
    }
    const handleNotesChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNotes(newValue ?? "");
    }
    const onClickAdd = async () => {
        var isValid = true;
        if (category.length === 0) {
            setCategoryErrorMessage("Invalid input");
            isValid = false;
        }

        if (procedure.length === 0) {
            setProcedureErrorMessage("Invalid input");
            isValid = false;
        }
        if (!isValid) {
            return;
        }
        const response = await fetch(`${BaseUrl}/taskCategory`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: category,
                procedure: procedure,
                notes: notes
            })
        })

        const data = await response.json();

        if (data) {
            setCategories(data.taskCategories);
            setShowCategoryDialog(false);
            setCategory('');
        }
    }

    const minWidth = ["s", "m", "l"].includes(viewPort) ? "100vw" : "500px";

    return (
        <Dialog minWidth={minWidth} isBlocking={true} hidden={!showCategoryDialog} onDismiss={() => { setShowCategoryDialog(false) }}>
            <Stack tokens={{ childrenGap: "25px" }} >
                <Text variant='xLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Add Category</Text>
                <TextField placeholder='Category Title' underlined={true} errorMessage={categoryErrorMessage} value={category} onChange={handleCategoryChange} />
                <TextField placeholder='Procedure' multiline={true} underlined={true} errorMessage={procedureErrorMessage} value={procedure} onChange={handleProcedureChange} />
                <TextField placeholder='Things to remember' multiline={true} underlined={true} value={notes} onChange={handleNotesChange} />
                <StackItem align='end'>
                    <PrimaryButton style={{ backgroundColor: "purple", borderRadius: "16px" }} text='Submit' onClick={onClickAdd}></PrimaryButton>
                </StackItem>
            </Stack>
        </Dialog>
    )
}

export default AddCategory;