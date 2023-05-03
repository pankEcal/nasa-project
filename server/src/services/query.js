// reusable way to make endpoints paginated

const DEFULT_PAGE_LIMIT = 0; // setting default limit to 0 which returns all the values in the db. It's mongo feature.

function getPagination(query) {
	// getting page and limit query values to return documents. If not passed from query then provide default values.
	const page = Math.abs(query.page) || 1;
	const limit = Math.abs(query.limit) || DEFULT_PAGE_LIMIT;

	// defining num of documents to skip.
	// example: for first page: 0, 2nd: initial limit value, 3rd: 2*limit value and so on ...
	const skip = (page - 1) * limit;

	// return requried query values to the API
	return {
		skip,
		limit,
	};
}

module.exports = { getPagination };
