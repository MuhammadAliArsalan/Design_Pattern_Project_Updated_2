import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Footer from "../components/common/Footer";
import Course_Card from "../components/core/Category/Course_Card";
import Course_Slider from "../components/core/Category/Course_Slider";
import Loading from "../components/common/Loading";

import { getCategoryPageData } from "../services/operations/pageAndComponentData";
import { fetchCourseCategories } from "../services/operations/courseDetailsAPI";

function Categories() {
  const { categoryName } = useParams();
  const [active, setActive] = useState(1);
  const [categoryPageData, setCategoryPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeSlug = (value = "") =>
    decodeURIComponent(value).trim().toLowerCase().replace(/\s+/g, "-");

  // Fetch All Categories
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCourseCategories();
        const selectedCategory = res.find(
          (ct) => normalizeSlug(ct.name) === normalizeSlug(categoryName),
        );

        if (!selectedCategory?._id) {
          setCategoryPageData(null);
          setCategoryId("");
          return;
        }

        setCategoryId(selectedCategory._id);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    })();
  }, [categoryName]);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        setLoading(true);
        try {
          const res = await getCategoryPageData(categoryId);
          setCategoryPageData(res);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  // console.log('======================================= ', categoryPageData)
  // console.log('categoryId ==================================== ', categoryId)

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }
  if (!loading && !categoryPageData) {
    return (
      <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
        No Courses found for selected Category
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Categories / `}
            <span className="text-yellow-25">
              {categoryPageData?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {categoryPageData?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {categoryPageData?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          <Course_Slider Courses={categoryPageData?.selectedCategory?.courses} />
        </div>
      </div>

      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {categoryPageData?.differentCategory?.name}
        </div>
        <div>
          <Course_Slider
            Courses={categoryPageData?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {categoryPageData?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, i) => (
                <Course_Card course={course} key={i} Height={"h-[300px]"} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Categories;
