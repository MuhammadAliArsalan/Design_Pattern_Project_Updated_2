/**
 * Category Controller
 * Patterns: ApiResponseFactory (Factory), CloudinaryService (Singleton)
 */

const Category           = require('../models/category');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');

const getRandomInt = (max) => Math.floor(Math.random() * max);


exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) return ApiResponseFactory.badRequest(res, 'All fields are required');

    await Category.create({ name, description });
    return ApiResponseFactory.success(res, { message: 'Category created successfully' });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while creating category');
  }
};


exports.showAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { name: true, description: true });
    return ApiResponseFactory.success(res, {
      message: 'All categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching categories');
  }
};


exports.getCategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({ path: 'courses', match: { status: 'Published' }, populate: 'ratingAndReviews' })
      .exec();

    if (!selectedCategory) return ApiResponseFactory.notFound(res, 'Category not found');
    if (selectedCategory.courses.length === 0) {
      return ApiResponseFactory.notFound(res, 'No published courses in this category');
    }

    const otherCategories  = await Category.find({ _id: { $ne: categoryId } });

   
    const randomCategoryId = otherCategories[getRandomInt(otherCategories.length)]._id;

     if (otherCategories.length === 0) {
      return ApiResponseFactory.success(res, {
        data: { selectedCategory, differentCategory: null, mostSellingCourses }
      });
    }

    const differentCategory = await Category.findById(randomCategoryId)
      .populate({ path: 'courses', match: { status: 'Published' } })
      .exec();

    const allCategories = await Category.find()
      .populate({ path: 'courses', match: { status: 'Published' }, populate: { path: 'instructor' } })
      .exec();

    const mostSellingCourses = allCategories
      .flatMap((c) => c.courses)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return ApiResponseFactory.success(res, {
      data: { selectedCategory, differentCategory, mostSellingCourses },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Internal server error');
  }
};
