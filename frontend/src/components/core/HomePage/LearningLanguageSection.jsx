import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"

const LearningLanguageSection = () => {
    return (
        <div className='mt-[130px] mb-10'>
            <div className='flex flex-col gap-5 items-center'>

                <div className='text-3xl lg:text-4xl font-semibold text-center'>
                    Your all-in-one toolkit for
                    <HighlightText text={" smarter learning"} />
                </div>

                <div className='lg:text-center text-richblack-600 mx-auto text-base font-medium lg:w-[70%]'>
                    Learn more effectively with structured paths, progress tracking, and personalized study plans.
                    Whether you are preparing for exams or building tech skills, everything stays organized in one place.
                </div>

                <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
                    <img
                        src={know_your_progress}
                        alt="KNowYourProgressImage"
                        className='object-contain lg:-mr-32 '
                    />
                    <img
                        src={compare_with_others}
                        alt="KNowYourProgressImage"
                        className='object-contain'
                    />
                    <img
                        src={plan_your_lesson}
                        alt="KNowYourProgressImage"
                        className='object-contain lg:-ml-36'
                    />
                </div>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                </div>

            </div>
        </div>
    )
}

export default LearningLanguageSection
