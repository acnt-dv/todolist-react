import React, {useState} from "react";

export const AddCategoryModal = ({submit, isLoading, setShowModal}) => {
    const [categoryName, setCategoryName] = useState(null);

    return (
        <div className='' onClick={() => setShowModal(false)}>
            <div className="submissionForm">
                <input
                    autoFocus
                    disabled={isLoading}
                    value={categoryName}
                    onChange={e => {
                        setCategoryName(e.target.value);
                    }}/>
                <button
                    onClick={() => submit(categoryName)}
                    style={{borderRadius: '5px'}}>
                    {isLoading ?
                        <div className='loaderStyle'>
                            <div className={`spinner-border spinner-border-lg  mt-5`}
                                 style={{width: '125px', height: '125px', color: '#046D'}}
                                 role="status"/>
                        </div> : 'ثبت'}
                </button>
            </div>
        </div>
    )
}