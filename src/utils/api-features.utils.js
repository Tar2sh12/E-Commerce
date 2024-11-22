export class ApiFeature {
    constructor(model, query, populate = []) {
        // Model for the query (e.g., Product | Category | SubCategory |...)
        this.model = model;
        // Query parameters from the request
        this.query = query;
        // Filters to apply
        this.filterObject = {};
        // Pagination settings
        this.paginationObject = {};
        // Populate settings
        this.populate = populate; // Array of objects { path: 'field', select: 'fields' }
    }

    // Pagination
    pagination() {
        const { page = 1, limit = 2 } = this.query;
        const skip = (page - 1) * limit;

        this.paginationObject = {
            limit: parseInt(limit),
            skip,
            page: parseInt(page)
        };

        console.log('============ paginationObject in pagination() ==========', this.paginationObject);

        this.mongooseQuery = this.model.paginate(this.filterObject, { ...this.paginationObject, populate: this.populate });
        return this;
    }

    // Sorting
    sort() {
        const { sort } = this.query;
        if (sort) {
            this.paginationObject.sort = sort;

            console.log('============ paginationObject in sort() ==========', this.paginationObject);

            this.mongooseQuery = this.model.paginate(this.filterObject, { ...this.paginationObject, populate: this.populate });
        }
        return this;
    }

    // Filtering
    filters() {
        const { page = 1, limit = 2, sort, ...filters } = this.query;

        const filtersAsString = JSON.stringify(filters);
        const replacedFilters = filtersAsString.replace(/lt|lte|gt|gte|regex/g, (match) => `$${match}`);
        this.filterObject = JSON.parse(replacedFilters);

        console.log('============ filterObject in filters() ==========', this.filterObject);

        this.mongooseQuery = this.model.paginate(this.filterObject, { ...this.paginationObject, populate: this.populate });
        return this;
    }

    // Populate
    populateFields() {
        if (this.populate.length > 0) {
            console.log('============ populate settings in populateFields() ==========', this.populate);

            this.mongooseQuery = this.model.paginate(this.filterObject, { ...this.paginationObject, populate: this.populate });
        }
        return this;
    }
}
