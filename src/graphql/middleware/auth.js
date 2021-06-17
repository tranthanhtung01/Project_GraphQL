import CourseModel from "../../model/course";

export const isAuthenticated = (root, args, context) => {
	if (!context.req.user) {
		return new Error('Not authenticated')
	}
};

export const isUserActivated = (root, args, context) => {
	if (!context.req.user.isActivated) {
		return new Error('User is not activated')
	}
};
export  const isAuthorized = async (root, args, {req}) => {

	const {user} = req,
		foundAuthor = await CourseModel.findOne({_id: args.id});
	if (!foundAuthor) return new Error('Course no longer exists');
	const isAuthor = foundAuthor.author.equals(user._id);
	if (!isAuthor) {
		return new Error('Not authorized');

	}
};