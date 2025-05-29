import { useEffect, useRef, useState } from "react";
import insertItemService from "../services/insertItemService";
import getList from "../services/getList";
import updateTheList from "../services/updateList";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import deleteEntry from "../services/deleteFromList";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import emptyImg from '../assets/images/empty.jpg';
import { DescriptionModal } from "./Modals/DescriptionModal";
import getLists from "../services/getLists";
import { AddCategoryModal } from "./Modals/AddCategoryModal";
import insertCategoryService from "../services/insertCategoryService";
import deleteCategoryService from "../services/deleteCategoryService";
import Collapsible from "./Collapsible";
import { toast } from "react-toastify";

export const Categories = ({ addingItems, userName, refresh, setRefresh, handleUser, isAddingMode, setIsAddingMode, addByKey, setAddByKey, activeList, setActiveList, setShowCategories }) => {
    const inputRef = useRef(null);
    const holdTimeoutRef = useRef(null);

    const startHoldTimer = (item) => {
        holdTimeoutRef.current = setTimeout(() => {
            handleItemClicked(item);
        }, 400);
    };

    const clearHoldTimer = () => {
        clearTimeout(holdTimeoutRef.current);
        setShowModal(false);
    };

    const [list, setList] = useState([]);
    const [body, setBody] = useState('body');
    const [newItemValue, setNewItemValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    function insertCategory(category) {
        setIsLoading(true);
        insertCategoryService({
            "category": userName.concat(category),
        }).then(() => {
            setActiveList(category);
            reload(category);
        });
    }

    function deleteCategory() {
        setIsLoading(true);
        deleteCategoryService({
            "category": userName.concat(activeList)
        }).then(() => {
            reload();
        });
    }

    function insertItem(category) {
        setIsLoading(true);
        setNewItemValue('');
        insertItemService({
            "category": userName.concat(category),
            "body": body
        }).then(() => {
            setRefresh(!refresh);
            setIsAddingMode(true);
            setAddByKey(false);
        });
    }

    function changeList(category) {
        setActiveList(category);
        setRefresh(!refresh);
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    async function updateList(category) {
        try {
            let listItems = JSON.parse(await getList(userName?.concat(category)))?.data;
            listItems && listItems.sort(function compareByDone(a, b) {
                return a.isDone - b.isDone;
            }
            );
            setList(listItems);
            setActiveList(category);
        } catch (e) {
            console.error(e);
        }
    }

    const copyFallback = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const success = document.execCommand('copy');
            console.log(success ? 'Copied (fallback)' : 'Failed (fallback)');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textarea);
    };

    const handleItemCopy = async (item) => {

        try {
            await navigator.clipboard.writeText(item?.items);
            toast.success("کپی شد");
        } catch (err) {
            console.error('ناموفق', err);
        }
    }

    const handleCategoryClicked = (item) => {
        setActiveList(item);
        setShowCategories(false);
    }

    async function handleSwipeToDelete(x) {
        setIsLoading(true);
        deleteCategory();
    }

    function handleItemClicked(item) {
        setActiveItem(item.items);
        setShowModal(true);
    }

    async function handleItemDoubleClicked(item) {
        await handleSwipeToDelete(item);
    }

    function reload(category) {
        async function getCategoryList() {
            let categories = [];
            let list = JSON.parse(await getLists())?.data;
            list.forEach(item => {
                if (Object.values(item)?.[0].includes(userName)) {
                    categories.push(Object.values(item)?.[0]?.replace(`${userName}`, ``));
                }
            });
            if (category) {
                let active = categories.find(x => x === category);
                setCategoryList(categories);
                setActiveList(active);
                return active
            }
            let firstItem = categories?.[0];
            setCategoryList(categories);
            setActiveList(firstItem);
            return firstItem;
        }

        // setIsAddingMode(false);
        setIsLoading(true);
        try {
            getCategoryList().then((firstItem) => updateList(firstItem).then(() => setIsLoading(false)));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!userName) handleUser();
        reload();
    }, [userName]);

    useEffect(() => {
        // if (!showCategoryModal) setIsAddingMode(true);
    }, [showCategoryModal]);

    useEffect(() => {
        setIsLoading(true);
        setList([]);
        updateList(activeList).then(() => {
            setIsLoading(false);
        });
    }, [refresh]);

    useEffect(() => {
        if (isAddingMode) {
            setTimeout(() => {
                inputRef.current?.focus();
                // inputRef?.current?.select();
            }, 100);
        }
    }, [isAddingMode]);

    useEffect(() => {
        if (addByKey) insertItem(activeList);
    }, [addByKey]);

    return (
        <div className="">
            <table id="items">
                {isLoading &&
                    <div className='loaderStyle'>
                        <div className={`spinner-border spinner-border-lg  mt-5`}
                            style={{ width: '125px', height: '125px', color: '#777' }}
                            role="status" />
                    </div>}

                <div style={{ height: '75vh', overflow: 'auto', backgroundColor: 'white' }}>
                    {categoryList && (categoryList.length < 1 && !isLoading) &&
                        <div style={{ height: '75vh', overflow: 'auto', display: 'flex', alignItems: 'center' }}>
                            <img alt={''} src={emptyImg} style={{ maxWidth: '100%' }} />
                        </div>
                    }

                    <>
                        {categoryList && categoryList
                            .map(item => (
                                <SwipeToDelete
                                    key={item.id}
                                    onDelete={() => handleSwipeToDelete(item)}
                                    height={55}
                                    transitionDuration={250}
                                    deleteWidth={75}
                                    deleteThreshold={75}
                                    showDeleteAction={true}
                                    deleteColor="rgba(250, 50, 50, 1.00)"
                                    deleteText="DELETE"
                                    disabled={false}
                                    id={`swiper-${item.id}`}
                                    className="my-swiper"
                                    rtl={false}
                                >
                                    <tr className="tableStyle">
                                        <td
                                            className="w-100"
                                            onClick={() => handleCategoryClicked(item)}
                                            onMouseDown={() => startHoldTimer(item)}
                                            onMouseUp={clearHoldTimer}
                                            onMouseLeave={clearHoldTimer}
                                            onTouchStart={() => startHoldTimer(item)}
                                            onTouchEnd={clearHoldTimer}
                                            onTouchCancel={clearHoldTimer}
                                        >
                                            {item}
                                        </td>
                                    </tr>
                                </SwipeToDelete>
                            ))
                        }
                    </>
                </div>
            </table>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <button
                    name={addingItems}
                    className="categoryPlusBtn fade-in"
                    onClick={() => setShowCategoryModal(true)}
                >
                    &#43;
                </button>
            </div>

            {showCategoryModal &&
                <AddCategoryModal submit={insertCategory} isLoading={isLoading} setShowModal={setShowCategoryModal} />
            }
            {showModal &&
                <DescriptionModal item={activeItem} setShowModal={setShowModal} />
            }
        </div>
    )
}