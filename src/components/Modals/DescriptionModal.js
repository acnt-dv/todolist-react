export const DescriptionModal = ({item, setShowModal}) => {
    return(
        <div className='modalStyle' onClick={() => setShowModal(false)}>
            <p>
                {item}
            </p>
        </div>
    )
}