import { DefaultButton, Dialog, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useEffect, useState } from 'react';
import { BaseUrl } from '../utilities';

function PrepList() {

    const [categories, setCategories] = useState<any[]>([])
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [category, setCategory] = useState('');
    const handleCategoryChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCategory(newValue ?? "");
    }
    useEffect(() => {
        fetch(`${BaseUrl}/taskCategories`)
            .then(response => response.json())
            .then(json => setCategories(json.taskCategories));
    }, []);

    const onClickAdd = async () => {
        const response = await fetch(`${BaseUrl}/taskCategory`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: category
            })
        })

        const data = await response.json();

        if (data) {
            setCategories(data.taskCategories);
            setShowCategoryDialog(false);
            setCategory('');
        }
    }

    return (

        <Stack tokens={{ childrenGap: "30px" }}>
            <Dialog hidden={!showCategoryDialog} onDismiss={() => { setShowCategoryDialog(false) }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <TextField placeholder='Category Name' required value={category} onChange={handleCategoryChange} />
                    <StackItem align='center'>
                        <PrimaryButton style={{ backgroundColor: "purple", width: "150px" }} text='Add Category' onClick={onClickAdd}></PrimaryButton>
                    </StackItem>
                </Stack>
            </Dialog>
            <Text variant='xxLarge' styles={{ root: { fontWeight: "bold", color: "purple" } }}>Prep List</Text>
            <Stack horizontal={true} tokens={{ childrenGap: "20px" }}>
                {categories.map((category, index) => {
                    return (
                        <StackItem key={index}>
                            <PrimaryButton text={category.name} styles={{ root: { borderRadius: "16px" } }} />
                        </StackItem>
                    )
                })}
                <StackItem>
                    <DefaultButton onClick={() => { setShowCategoryDialog(true) }} styles={{ root: { borderRadius: "16px" } }} key="addCategory" text="Add Category" iconProps={{ iconName: "Add" }} />
                </StackItem>
            </Stack>
        </Stack>
    )
}

export default PrepList;