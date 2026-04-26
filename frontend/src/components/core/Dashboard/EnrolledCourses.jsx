import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { verifyStripeCheckoutSession } from "../../../services/operations/studentFeaturesAPI"
import Img from './../../common/Img';



export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const location = useLocation()

  const hasPlayableLecture = (course) => {
    const firstSection = course?.courseContent?.find(
      (section) => section?._id && Array.isArray(section.subSection) && section.subSection.length > 0,
    )
    const firstSubSection = firstSection?.subSection?.find((sub) => sub?._id)
    return !!firstSection && !!firstSubSection
  }

  const openEnrolledCourse = (course) => {
    const firstSection = course?.courseContent?.find(
      (section) => section?._id && Array.isArray(section.subSection) && section.subSection.length > 0,
    )
    const firstSubSection = firstSection?.subSection?.find((sub) => sub?._id)

    if (firstSection && firstSubSection) {
      navigate(
        `/view-course/${course?._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`,
      )
      return
    }

    if (course?._id) {
      navigate(`/courses/${course._id}`)
      return
    }

    toast.error("Could not open this enrolled course because no valid content was found.")
  }

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const sessionId = searchParams.get("session_id")

    if (!sessionId || !token) {
      return
    }

    const verifyStripeSession = async () => {
      try {
        const response = await verifyStripeCheckoutSession(sessionId, token)
        if (response?.data?.success) {
          toast.success("Stripe payment confirmed and course enrollment successful.")
          await getEnrolledCourses()
          window.history.replaceState({}, document.title, "/dashboard/enrolled-courses")
        } else {
          throw new Error(response?.data?.message || "Stripe session verification failed")
        }
      } catch (error) {
        console.log("Stripe verification error:", error)
        toast.error("Could not verify Stripe payment. Please contact support.")
      }
    }

    verifyStripeSession()
  }, [location.search, token])

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

  // return if data is null
  if (enrolledCourses?.length == 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You have not enrolled in any course yet.
      </p>)
  }



  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Enrolled Courses</div>
      {
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-2xl bg-richblack-800 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>


          {/* loading Skeleton */}
          {!enrolledCourses && <div >
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>}

          {/* Course Names */}
          {
            enrolledCourses?.map((course, i, arr) => (
              <div
                className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
                key={i}
              >
                <div
                  className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                  onClick={() => openEnrolledCourse(course)}
                >
                  <Img
                    src={course.thumbnail}
                    alt="course_img"
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <div className="flex max-w-xs flex-col gap-2">
                    <p className="font-semibold">{course.courseName}</p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.length > 50
                        ? `${course.courseDescription.slice(0, 50)}...`
                        : course.courseDescription}
                    </p>
                    {!hasPlayableLecture(course) && (
                      <span className="inline-flex items-center rounded-full bg-yellow-900 px-2 py-1 text-xs text-yellow-100">
                        No lecture available
                      </span>
                    )}
                  </div>
                </div>

                {/* only for smaller devices */}
                {/* duration -  progress */}
                <div className='sm:hidden'>
                  <div className=" px-2 py-3">{course?.totalDuration}</div>

                  <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                    {/* {console.log('Course ============== ', course.progressPercentage)} */}

                    <p>Progress: {course.progressPercentage || 0}%</p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                    />
                  </div>
                </div>

                {/* only for larger devices */}
                {/* duration -  progress */}
                <div className="hidden w-1/5 sm:flex px-2 py-3">{course?.totalDuration}</div>
                <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
                  <p>Progress: {course.progressPercentage || 0}%</p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            ))
          }
        </div>
      }
    </>
  )
}