import React, {useState} from "react";

export const AddCategoryModal = ({submit, isLoading, setShowModal}) => {
    const [categoryName, setCategoryName] = useState(null);

    return (
        <div onClick={()=> setShowModal(false)}>
            <div className="submissionForm">
                <input
                    autoFocus
                    disabled={isLoading}
                    value={categoryName}
                    onChange={e => {
                        setCategoryName(e.target.value);
                    }}/>
                <button
                    onClick={() => {submit(categoryName);}}
                    style={{borderRadius: '5px', padding: '2px', minWidth: '50px'}}>
                    ثبت
                </button>
            </div>
        </div>
    )
}