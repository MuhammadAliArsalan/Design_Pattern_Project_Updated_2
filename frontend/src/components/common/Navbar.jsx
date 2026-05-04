import React, { useState, useEffect } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { NavbarLinks } from "../../../data/navbar-links"
// import studyNotionLogo from '../../assets/Logo/Logo-Full-Light.png'
import studyNotionLogo from '../../assets/Logo/StudySync_logo.png'
import { fetchCourseCategories } from './../../services/operations/courseDetailsAPI';

import ProfileDropDown from '../core/Auth/ProfileDropDown'
import MobileProfileDropDown from '../core/Auth/MobileProfileDropDown'

import { AiOutlineShoppingCart } from "react-icons/ai"
import { MdKeyboardArrowDown } from "react-icons/md"




const Navbar = () => {
    // console.log("Printing base url: ", import.meta.env.VITE_APP_BASE_URL);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    // console.log('USER data from Navbar (store) = ', user)
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchSublinks = async () => {
        try {
            setLoading(true)
            const res = await fetchCourseCategories();
            setSubLinks(Array.isArray(res) ? res : []);
        }
        catch (error) {
            console.log("Could not fetch the category list = ", error);
            setSubLinks([]);
        }
        setLoading(false)
    }

    // console.log('data of store  = ', useSelector((state)=> state))


    useEffect(() => {
        fetchSublinks();
    }, [])


    const matchRoute = (route) => {
        if (!route) return false;
        return matchPath({ path: route }, location.pathname);
    }


    // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar 
    const [showNavbar, setShowNavbar] = useState('top');
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        }
    },)

    // control Navbar
    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY)
                setShowNavbar('hide')

            else setShowNavbar('show')
        }

        else setShowNavbar('top')

        setLastScrollY(window.scrollY);
    }



    return (
        <nav className={`z-[10] flex h-14 w-full items-center justify-center border-b-[1px] border-b-richblack-700 text-white translate-y-0 transition-all ${showNavbar} `}>
            {/* <nav className={` fixed flex items-center justify-center w-full h-16 z-[10] translate-y-0 transition-all text-white ${showNavbar}`}> */}
            <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
                {/* logo */}
                <Link to="/">
                    <img src={studyNotionLogo} width={160} height={42} loading='lazy' />
                </Link>

                {/* Nav Links - visible for only large devices*/}
                <ul className='hidden sm:flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {
                                    link.title === "Category" ? (
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/category/:categoryName")
                                                ? "bg-blue-200 text-black rounded-xl p-1 px-3"
                                                : "text-richblack-25 rounded-xl p-1 px-3"
                                                }`}
                                        >
                                            <p>{link.title}</p>
                                            <MdKeyboardArrowDown />
                                            {/* drop down menu */}
                                            <div className="invisible absolute left-0 top-full z-[1000] mt-2 flex w-[200px] flex-col rounded-lg bg-richblack-5 p-3 text-richblack-900 opacity-0 shadow-2xl translate-y-2 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 lg:w-[300px]"
                                            >
                                                <div className="absolute left-4 top-0 z-[100] h-4 w-4 -translate-y-1 rotate-45 rounded-sm bg-richblack-5"></div>
                                                {loading ? (
                                                    <p className="text-center py-4">Loading...</p>
                                                ) : subLinks.length ? (
                                                    <>
                                                        {subLinks.map((subLink, i) => {
                                                            const slug = encodeURIComponent(
                                                                subLink.name.trim().split(/\s+/).join("-").toLowerCase()
                                                            )
                                                            return (
                                                                <Link
                                                                    key={i}
                                                                    to={`/category/${slug}`}
                                                                    className="rounded-lg bg-transparent px-4 py-3 text-sm text-richblack-900 transition-colors hover:bg-richblack-50"
                                                                >
                                                                    {subLink.name}
                                                                </Link>
                                                            )
                                                        })}
                                                    </>
                                                ) : (
                                                    <p className="text-center py-4">No categories available</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 
    ${matchRoute(link?.path)
                                                    ? "bg-blue-600/20 text-blue-200 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))}
                </ul>




                {/* Login/SignUp/Dashboard */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart className="text-[2.35rem] text-richblack-5 hover:bg-richblack-700 rounded-full p-2 duration-200" />
                                {totalItems > 0 && (
                                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-blue-100">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )
                    }
                    {token === null && (
                        <div className="flex items-center gap-x-3">
                            <Link to="/login">
                                <button className="text-sm font-medium text-gray-700 hover:text-blue-100 transition-colors px-4 py-2">
                                    Log In
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="text-sm font-semibold bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-300">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* for large devices */}
                    {token !== null && <ProfileDropDown />}

                    {/* for small devices */}
                    {token !== null && <MobileProfileDropDown />}

                </div>
            </div>
        </nav>
    )
}

export default Navbar
