import React, {useState} from "react";

export const AddCategoryModal = ({submit, isLoading, setShowModal}) => {
    const [categoryName, setCategoryName] = useState(null);

    return (
        <div className="d-flex justify-content-center w-75" onClick={()=> setShowModal(false)}>
            <div className="submissionForm">
                <input
                    className="addCategoryInput"
                    autoFocus
                    disabled={isLoading}
                    value={categoryName}
                    onChange={e => {
                        setCategoryName(e.target.value);
                    }}/>
                <button
                    className="addCategoryButton"
                    onClick={() => {submit(categoryName);}}>
                    ثبت
                </button>
            </div>
        </div>
    )
}